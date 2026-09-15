import test from "node:test";
import assert from "node:assert/strict";
import { generateConfig } from "../lib/generator.js";
import {
  AGENT_SKILLS,
  PONYTAIL_SKILLS,
  CYBERSECURITY_SKILLS,
  DESIGN_MD_PRESETS
} from "../lib/skills-catalog.js";
import { ALL_100_DESIGN_THEMES } from "../lib/themes-catalog.js";

test("Skills Catalog integrity", () => {
  assert.ok(AGENT_SKILLS.length > 0, "AGENT_SKILLS should not be empty");
  assert.ok(PONYTAIL_SKILLS.length > 0, "PONYTAIL_SKILLS should not be empty");
  assert.ok(CYBERSECURITY_SKILLS.length > 0, "CYBERSECURITY_SKILLS should not be empty");
  assert.ok(Object.keys(DESIGN_MD_PRESETS).length > 0, "DESIGN_MD_PRESETS should have keys");

  for (const skill of AGENT_SKILLS) {
    assert.ok(skill.id, "Skill should have an id");
    assert.ok(skill.title, "Skill should have a title");
    assert.ok(skill.content, "Skill should have content");
  }
});

test("Themes Catalog integrity", () => {
  assert.ok(ALL_100_DESIGN_THEMES.length >= 100, "Should have at least 100 design themes");

  for (const theme of ALL_100_DESIGN_THEMES) {
    assert.ok(theme.id, `Theme ${theme.id || "unknown"} should have an id`);
    assert.ok(theme.name, `Theme ${theme.id} should have a name`);
    assert.ok(theme.accent, `Theme ${theme.id} should have an accent color`);
    assert.ok(theme.canvas, `Theme ${theme.id} should have a canvas color`);
  }
});

test("generateConfig produces valid files for targetCli='both'", () => {
  const files = generateConfig({
    targetCli: "both",
    scope: "project",
    agentSkills: { enabled: true, mode: "all", selectedSkills: [] },
    ponytail: { enabled: true, mode: "full", includeSkills: true },
    headroom: { enabled: true, includeMcp: true, includeSkill: true, includeRules: true },
    graphify: { enabled: true, includeMcp: true, mcpCommand: "uv" },
    designSuite: {
      enabled: true,
      tasteSkill: true,
      impeccable: true,
      emilAnimations: true,
      designMdPreset: "linear",
      designVariance: 8,
      motionIntensity: 6,
      visualDensity: 4
    },
    cybersecurity: {
      enabled: true,
      appsecAudit: true,
      threatModeling: true,
      secretScanning: true,
      depAudit: true
    }
  });

  assert.ok(Array.isArray(files), "Files output should be an array");
  assert.ok(files.length > 10, "Should generate multiple files");

  const filePaths = files.map(f => f.path);

  // Agent rules
  assert.ok(filePaths.includes("AGENTS.md"), "Should include AGENTS.md");
  assert.ok(filePaths.includes("GEMINI.md"), "Should include GEMINI.md");
  assert.ok(filePaths.includes("CLAUDE.md"), "Should include CLAUDE.md");
  assert.ok(filePaths.includes("DESIGN.md"), "Should include DESIGN.md");

  // Verify skills are routed for both Antigravity (.agents/) and Claude (.claude/)
  const agentsSkills = filePaths.filter(p => p.startsWith(".agents/skills/"));
  const claudeSkills = filePaths.filter(p => p.startsWith(".claude/skills/"));
  assert.ok(agentsSkills.length > 0, "Should generate .agents/ skills");
  assert.ok(claudeSkills.length > 0, "Should generate .claude/ skills");

  // Verify MCP configs
  assert.ok(filePaths.includes(".agents/mcp_config.json"), "Should generate .agents/mcp_config.json");
  assert.ok(filePaths.includes(".claude/settings.json"), "Should generate .claude/settings.json");

  // Verify none of the paths are absolute or dangerous
  for (const file of files) {
    assert.ok(!file.path.startsWith("/"), `File path ${file.path} should not be absolute`);
    assert.ok(!file.path.includes(".."), `File path ${file.path} should not traverse directories`);
    assert.ok(typeof file.content === "string" && file.content.length > 0, `File ${file.path} must have content`);
  }
});
