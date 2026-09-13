// lib/installer.js - Environment detection, file writing, and command execution

import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { exec, spawn } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

/**
 * Expand tilde in path to user home
 */
export function resolveUserPath(inputPath) {
  if (!inputPath) return process.cwd();
  if (inputPath.startsWith("~")) {
    return path.join(os.homedir(), inputPath.slice(1));
  }
  return path.resolve(inputPath);
}

/**
 * Check if a command is available on PATH and get its version
 */
async function checkBinary(binaryName, versionFlag = "--version") {
  try {
    const { stdout } = await execAsync(`which ${binaryName}`);
    const binPath = stdout.trim();
    if (!binPath) return { available: false, path: null, version: null };

    try {
      const { stdout: verOut } = await execAsync(`${binaryName} ${versionFlag}`);
      const firstLine = verOut.trim().split("\n")[0];
      return { available: true, path: binPath, version: firstLine };
    } catch {
      return { available: true, path: binPath, version: "Available" };
    }
  } catch {
    return { available: false, path: null, version: null };
  }
}

/**
 * Detect full system environment
 */
export async function detectEnvironment() {
  const [nodeInfo, npmInfo, pyInfo, pipInfo, gitInfo, agyInfo, claudeInfo, uvInfo] =
    await Promise.all([
      checkBinary("node", "-v"),
      checkBinary("npm", "-v"),
      checkBinary("python3", "--version"),
      checkBinary("pip", "--version"),
      checkBinary("git", "--version"),
      checkBinary("agy", "--version"),
      checkBinary("claude", "--version"),
      checkBinary("uv", "--version")
    ]);

  const homeDir = os.homedir();
  const geminiConfigDir = path.join(homeDir, ".gemini");
  const claudeConfigDir = path.join(homeDir, ".claude");

  let geminiExists = false;
  let claudeExists = false;

  try {
    await fs.access(geminiConfigDir);
    geminiExists = true;
  } catch {}

  try {
    await fs.access(claudeConfigDir);
    claudeExists = true;
  } catch {}

  return {
    os: {
      platform: os.platform(),
      release: os.release(),
      homedir: homeDir
    },
    binaries: {
      node: nodeInfo,
      npm: npmInfo,
      python3: pyInfo,
      pip: pipInfo,
      git: gitInfo,
      agy: agyInfo,
      claude: claudeInfo,
      uv: uvInfo
    },
    globalDirectories: {
      gemini: { path: geminiConfigDir, exists: geminiExists },
      claude: { path: claudeConfigDir, exists: claudeExists }
    }
  };
}

/**
 * Inspect target project path for existing agent configs
 */
export async function inspectProjectPath(targetDir) {
  const resolvedDir = resolveUserPath(targetDir);
  const result = {
    targetDir: resolvedDir,
    exists: false,
    isGitRepo: false,
    existingFiles: [],
    detectedConfigs: {
      hasAgentsMd: false,
      hasGeminiMd: false,
      hasClaudeMd: false,
      hasAgentsDir: false,
      hasClaudeDir: false,
      hasMcpConfig: false,
      skillsCount: 0,
      rulesCount: 0
    }
  };

  try {
    const stat = await fs.stat(resolvedDir);
    if (!stat.isDirectory()) {
      return { ...result, error: "Path exists but is not a directory" };
    }
    result.exists = true;
  } catch {
    return result;
  }

  // Check git repo
  try {
    await fs.access(path.join(resolvedDir, ".git"));
    result.isGitRepo = true;
  } catch {}

  const filesToCheck = [
    "AGENTS.md",
    "GEMINI.md",
    "CLAUDE.md",
    ".agents",
    ".claude",
    ".agents/mcp_config.json",
    ".claude/settings.json",
    "setup-ai-environment.sh"
  ];

  for (const item of filesToCheck) {
    const fullItemPath = path.join(resolvedDir, item);
    try {
      const s = await fs.stat(fullItemPath);
      result.existingFiles.push({
        path: item,
        isDirectory: s.isDirectory(),
        size: s.size
      });
      if (item === "AGENTS.md") result.detectedConfigs.hasAgentsMd = true;
      if (item === "GEMINI.md") result.detectedConfigs.hasGeminiMd = true;
      if (item === "CLAUDE.md") result.detectedConfigs.hasClaudeMd = true;
      if (item === ".agents") result.detectedConfigs.hasAgentsDir = true;
      if (item === ".claude") result.detectedConfigs.hasClaudeDir = true;
      if (item.includes("mcp_config") || item.includes("settings.json")) result.detectedConfigs.hasMcpConfig = true;
    } catch {}
  }

  // Count existing skills in .agents/skills and .claude/skills
  const countSkills = async (skillsDir) => {
    try {
      const entries = await fs.readdir(skillsDir, { withFileTypes: true });
      return entries.filter(e => e.isDirectory()).length;
    } catch {
      return 0;
    }
  };

  const agentsSkillsCount = await countSkills(path.join(resolvedDir, ".agents", "skills"));
  const claudeSkillsCount = await countSkills(path.join(resolvedDir, ".claude", "skills"));
  result.detectedConfigs.skillsCount = agentsSkillsCount + claudeSkillsCount;

  return result;
}

/**
 * Write generated files to the target project directory
 */
export async function writeFilesToProject(targetDir, files = []) {
  const resolvedTarget = resolveUserPath(targetDir);
  await fs.mkdir(resolvedTarget, { recursive: true });

  const written = [];
  const errors = [];

  for (const file of files) {
    let filePath;
    if (file.path.startsWith("~")) {
      filePath = resolveUserPath(file.path);
    } else {
      filePath = path.join(resolvedTarget, file.path);
    }

    try {
      const parentDir = path.dirname(filePath);
      await fs.mkdir(parentDir, { recursive: true });
      await fs.writeFile(filePath, file.content, "utf-8");

      // If script, make executable
      if (file.category === "script" || file.path.endsWith(".sh")) {
        try {
          await fs.chmod(filePath, 0o755);
        } catch {}
      }

      written.push({ path: file.path, resolvedPath: filePath, size: file.content.length });
    } catch (err) {
      errors.push({ path: file.path, error: err.message });
    }
  }

  return {
    success: errors.length === 0,
    targetDir: resolvedTarget,
    writtenFiles: written,
    errors
  };
}

/**
 * Run a command and return stdout/stderr
 */
export function executeCommandStreaming(cmd, cwd, onData, onEnd) {
  const child = spawn("bash", ["-c", cmd], {
    cwd: resolveUserPath(cwd),
    env: { ...process.env, TERM: "xterm-256color" }
  });

  child.stdout.on("data", (chunk) => onData({ type: "stdout", text: chunk.toString() }));
  child.stderr.on("data", (chunk) => onData({ type: "stderr", text: chunk.toString() }));

  child.on("close", (code) => {
    onEnd({ code, success: code === 0 });
  });

  child.on("error", (err) => {
    onData({ type: "stderr", text: `Error spawning process: ${err.message}\n` });
    onEnd({ code: -1, success: false });
  });

  return child;
}
