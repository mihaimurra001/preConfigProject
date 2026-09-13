// server.js - Backend server for AI Agent Project Configurator

import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execAsync = promisify(exec);
import {
  detectEnvironment,
  inspectProjectPath,
  writeFilesToProject,
  executeCommandStreaming,
  resolveUserPath
} from "./lib/installer.js";
import { generateConfig } from "./lib/generator.js";
import {
  AGENT_SKILLS,
  PONYTAIL_RULES,
  PONYTAIL_SKILLS,
  GRAPHIFY_TEMPLATES,
  STACK_PRESETS,
  DESIGN_SKILLS,
  DESIGN_MD_PRESETS,
  CYBERSECURITY_SKILLS,
  CYBERSECURITY_RULES,
  HEADROOM_SKILL,
  HEADROOM_RULES,
  HEADROOM_TEMPLATES
} from "./lib/skills-catalog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SAVED_PROJECTS_FILE = path.join(__dirname, "saved_projects.json");

async function loadSavedProjects() {
  try {
    if (existsSync(SAVED_PROJECTS_FILE)) {
      const data = await fs.readFile(SAVED_PROJECTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading saved projects:", err);
  }
  const defaults = [
    {
      id: "preconfig-project",
      name: "PreConfigurator (Proiect Curent)",
      path: "/home/oem/proiecte/preConfigProject",
      updatedAt: new Date().toISOString()
    },
    {
      id: "proiecte-root",
      name: "Workspace Proiecte",
      path: "/home/oem/proiecte",
      updatedAt: new Date().toISOString()
    }
  ];
  await fs.writeFile(SAVED_PROJECTS_FILE, JSON.stringify(defaults, null, 2), "utf-8");
  return defaults;
}

async function saveSavedProjects(list) {
  await fs.writeFile(SAVED_PROJECTS_FILE, JSON.stringify(list, null, 2), "utf-8");
}

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 1. Get system environment
app.get("/api/environment", async (req, res) => {
  try {
    const env = await detectEnvironment();
    res.json({ ok: true, data: env });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 2. Get skills and options catalog
app.get("/api/skills-catalog", (req, res) => {
  res.json({
    ok: true,
    data: {
      agentSkills: AGENT_SKILLS,
      ponytail: {
        modes: Object.keys(PONYTAIL_RULES),
        skills: PONYTAIL_SKILLS
      },
      headroom: {
        skill: HEADROOM_SKILL,
        rule: HEADROOM_RULES,
        mcpSnippet: HEADROOM_TEMPLATES.mcpConfigSnippet,
        features: ["SmartCrusher JSON Compression", "CodeCompressor AST Simplifier", "Kompress-v2 Prose & Log Compression", "Context Compression Retrieval (CCR)"]
      },
      graphify: {
        features: ["Knowledge Graph AST Parser", "Deterministic Local Leiden Clustering", "MCP Server", "Obsidian Vault Export", "Wiki Articles"],
        mcpSnippet: GRAPHIFY_TEMPLATES.mcpConfigSnippet
      },
      designSuite: {
        skills: DESIGN_SKILLS,
        presets: Object.keys(DESIGN_MD_PRESETS)
      },
      cybersecurity: {
        skills: CYBERSECURITY_SKILLS,
        rule: CYBERSECURITY_RULES
      },
      stacks: Object.keys(STACK_PRESETS)
    }
  });
});

// 3. Inspect target project path
app.post("/api/inspect-path", async (req, res) => {
  try {
    const targetDir = req.body.targetDir || process.cwd();
    const inspection = await inspectProjectPath(targetDir);
    res.json({ ok: true, data: inspection });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 3a. Native OS directory picker dialog (Linux zenity / Windows PowerShell / macOS osascript)
app.post("/api/browse-directory", async (req, res) => {
  const currentDir = resolveUserPath(req.body.currentDir || process.cwd());
  const platform = process.platform;

  try {
    if (platform === "linux") {
      try {
        const cmd = `zenity --file-selection --directory --title="Selectează Folder Proiect" --filename="${currentDir}/"`;
        const { stdout } = await execAsync(cmd);
        const selected = stdout.trim();
        if (selected) {
          return res.json({ ok: true, path: selected });
        }
        return res.json({ ok: false, cancelled: true });
      } catch (zenityErr) {
        if (zenityErr.code === 1 || zenityErr.code === 5) {
          return res.json({ ok: false, cancelled: true });
        }
        return res.json({ ok: false, fallback: true, error: zenityErr.message });
      }
    } else if (platform === "win32") {
      try {
        const safePath = currentDir.replace(/\\/g, "\\\\");
        const psCmd = `powershell.exe -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.FolderBrowserDialog; $f.SelectedPath = '${safePath}'; if ($f.ShowDialog() -eq 'OK') { Write-Host $f.SelectedPath }"`;
        const { stdout } = await execAsync(psCmd);
        const selected = stdout.trim();
        if (selected) {
          return res.json({ ok: true, path: selected });
        }
        return res.json({ ok: false, cancelled: true });
      } catch (winErr) {
        return res.json({ ok: false, fallback: true, error: winErr.message });
      }
    } else if (platform === "darwin") {
      try {
        const macCmd = `osascript -e 'POSIX path of (choose folder with prompt "Selectează Folder Proiect")'`;
        const { stdout } = await execAsync(macCmd);
        const selected = stdout.trim();
        if (selected) {
          return res.json({ ok: true, path: selected });
        }
        return res.json({ ok: false, cancelled: true });
      } catch (macErr) {
        return res.json({ ok: false, fallback: true, error: macErr.message });
      }
    } else {
      return res.json({ ok: false, fallback: true, error: "Platform not supported for native dialog" });
    }
  } catch (err) {
    return res.json({ ok: false, fallback: true, error: err.message });
  }
});

// 3b. In-app filesystem directory browser
app.post("/api/browse-fs", async (req, res) => {
  try {
    const reqDir = req.body.dir ? req.body.dir.trim() : "";
    let targetPath = resolveUserPath(reqDir || process.cwd());
    if (!existsSync(targetPath)) {
      targetPath = process.cwd();
    }
    const stat = await fs.stat(targetPath);
    if (!stat.isDirectory()) {
      targetPath = path.dirname(targetPath);
    }
    const entries = await fs.readdir(targetPath, { withFileTypes: true });
    const directories = entries
      .filter(e => e.isDirectory() && !e.name.startsWith("."))
      .map(e => ({
        name: e.name,
        path: path.join(targetPath, e.name)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const parentPath = path.dirname(targetPath);
    const isRoot = parentPath === targetPath;

    res.json({
      ok: true,
      currentPath: targetPath,
      parentPath: isRoot ? null : parentPath,
      isRoot,
      directories
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 3c. Saved projects list CRUD
app.get("/api/saved-projects", async (req, res) => {
  try {
    const list = await loadSavedProjects();
    res.json({ ok: true, data: list });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/saved-projects", async (req, res) => {
  try {
    const { id, name, path: projPath } = req.body;
    if (!projPath) {
      return res.status(400).json({ ok: false, error: "Calea proiectului este obligatorie" });
    }
    const list = await loadSavedProjects();
    const resolved = resolveUserPath(projPath);
    const projectName = name && name.trim() ? name.trim() : path.basename(resolved) || resolved;
    
    const existingIndex = id ? list.findIndex(p => p.id === id) : -1;
    const projectItem = {
      id: id || `proj_${Date.now()}`,
      name: projectName,
      path: resolved,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      list[existingIndex] = projectItem;
    } else {
      const pathIdx = list.findIndex(p => p.path === projectItem.path);
      if (pathIdx >= 0) {
        list[pathIdx] = { ...list[pathIdx], ...projectItem };
      } else {
        list.push(projectItem);
      }
    }

    await saveSavedProjects(list);
    res.json({ ok: true, data: list, saved: projectItem });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete("/api/saved-projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let list = await loadSavedProjects();
    list = list.filter(p => p.id !== id);
    await saveSavedProjects(list);
    res.json({ ok: true, data: list });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 4. Generate preview of configuration files
app.post("/api/preview", (req, res) => {
  try {
    const files = generateConfig(req.body);
    res.json({
      ok: true,
      data: {
        totalFiles: files.length,
        files: files.map(f => ({
          path: f.path,
          category: f.category,
          description: f.description,
          content: f.content,
          size: f.content.length
        }))
      }
    });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// 5. Apply configuration to target project
app.post("/api/apply", async (req, res) => {
  try {
    const { targetDir = process.cwd(), ...configOptions } = req.body;
    const files = generateConfig(configOptions);
    const writeResult = await writeFilesToProject(targetDir, files);
    res.json({ ok: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 6. SSE endpoint for streaming command execution
app.get("/api/stream-command", (req, res) => {
  const { cmd, cwd } = req.query;

  if (!cmd) {
    return res.status(400).json({ ok: false, error: "Command parameter 'cmd' is required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendEvent = (eventType, data) => {
    res.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent("start", { cmd, cwd: cwd || process.cwd() });

  executeCommandStreaming(
    cmd,
    cwd || process.cwd(),
    (output) => {
      sendEvent("output", output);
    },
    (status) => {
      sendEvent("complete", status);
      res.end();
    }
  );

  req.on("close", () => {
    // Client closed connection
  });
});

app.listen(PORT, () => {
  console.log(`\n========================================================`);
  console.log(`🚀 AI Agent Configurator running on http://localhost:${PORT}`);
  console.log(`   Managing Antigravity CLI & Claude Code CLI configurations`);
  console.log(`========================================================\n`);
});
