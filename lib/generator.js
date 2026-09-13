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
} from "./skills-catalog.js";

/**
 * Generate configuration files based on selected options.
 * @param {Object} options
 * @returns {Array<{ path: string, content: string, category: string, description: string }>}
 */
export function generateConfig(options = {}) {
  const {
    targetCli = "both", // "antigravity" | "claude" | "both"
    scope = "project",  // "project" | "global"
    agentSkills = { enabled: true, mode: "core", selectedSkills: [] },
    ponytail = { enabled: true, mode: "full", includeSkills: true },
    headroom = { enabled: true, includeMcp: true, includeSkill: true, includeRules: true },
    graphify = { enabled: true, includeMcp: true, mcpCommand: "uv" },
    designSuite = {
      enabled: true,
      tasteSkill: true,
      impeccable: true,
      emilAnimations: true,
      designMdPreset: "linear",
      designVariance: 8,
      motionIntensity: 6,
      visualDensity: 4
    },
    cybersecurity = {
      enabled: true,
      appsecAudit: true,
      threatModeling: true,
      secretScanning: true,
      depAudit: true
    },
    projectRules = {
      stack: "typescript",
      testCoverage: true,
      gitCommitConventions: true,
      customRules: ""
    }
  } = options;

  const files = [];

  const isAntigravity = targetCli === "antigravity" || targetCli === "both";
  const isClaude = targetCli === "claude" || targetCli === "both";

  // 1. Compile consolidated Agent Rules (AGENTS.md / GEMINI.md / CLAUDE.md)
  let ruleSections = [];

  // Stack preset
  if (projectRules.stack && STACK_PRESETS[projectRules.stack]) {
    ruleSections.push(STACK_PRESETS[projectRules.stack]);
  }

  // Testing & Quality Gates
  if (projectRules.testCoverage) {
    ruleSections.push(`## Verification & Testing Standard
- Every non-trivial code modification must be backed by an automated test.
- Verify tests pass locally before declaring a task complete.
- Strive for regression test reproduction prior to applying bug fixes.`);
  }

  // Git Commit Conventions
  if (projectRules.gitCommitConventions) {
    ruleSections.push(`## Commit Message Conventions
- Use Conventional Commits format: \`feat:\`, \`fix:\`, \`refactor:\`, \`test:\`, \`docs:\`, \`chore:\`.
- Keep commit subjects concise (max 72 chars), imperative, and present tense.`);
  }

  // Ponytail lazy senior dev rules
  if (ponytail.enabled) {
    const pMode = ponytail.mode || "full";
    const pRule = PONYTAIL_RULES[pMode] || PONYTAIL_RULES.full;
    ruleSections.push(pRule);
  }

  // Headroom Context & Token Compression Standards
  if (headroom && headroom.enabled && headroom.includeRules) {
    ruleSections.push(HEADROOM_RULES);
  }

  // Graphify integration guidance
  if (graphify.enabled) {
    ruleSections.push(GRAPHIFY_TEMPLATES.rule);
  }

  // Design Suite Guidance
  if (designSuite && designSuite.enabled) {
    if (designSuite.designMdPreset && designSuite.designMdPreset !== "none") {
      ruleSections.push(`## Visual & Frontend Design Language (DESIGN.md)
- Consult \`DESIGN.md\` for color tokens, typography hierarchy, surface depths, and border radii.
- Avoid generic AI aesthetic (no purple gradients, no Inter-for-everything, no cards-inside-cards).`);
    }

    if (designSuite.tasteSkill) {
      ruleSections.push(`## Frontend Taste & Anti-Slop (Taste-Skill)
- Infer design direction first before generating UI.
- Set the Three Dials: DESIGN_VARIANCE: ${designSuite.designVariance || 8}, MOTION_INTENSITY: ${designSuite.motionIntensity || 6}, VISUAL_DENSITY: ${designSuite.visualDensity || 4}.`);
    }

    if (designSuite.emilAnimations) {
      ruleSections.push(`## Interaction & Motion Standards (Emil Kowalski)
- Never use \`ease-in\` for entering elements (use decelerating \`ease-out\`).
- Animate only hardware-accelerated properties (\`transform\`, \`opacity\`).
- Keep micro-interactions under 250ms.`);
    }
  }

  // Cybersecurity Standards
  if (cybersecurity && cybersecurity.enabled) {
    ruleSections.push(CYBERSECURITY_RULES);
  }

  // Custom User Rules
  if (projectRules.customRules && projectRules.customRules.trim()) {
    ruleSections.push(`## Project-Specific Guidelines\n${projectRules.customRules.trim()}`);
  }

  const consolidatedRulesContent = ruleSections.join("\n\n---\n\n");

  // Determine which Agent Skills are selected
  let skillsToInclude = [];
  if (agentSkills.enabled) {
    if (agentSkills.mode === "all") {
      skillsToInclude = [...AGENT_SKILLS];
    } else if (agentSkills.mode === "core") {
      const coreIds = [
        "spec-driven-development",
        "planning-and-task-breakdown",
        "incremental-implementation",
        "test-driven-development",
        "code-review-and-quality",
        "code-simplification",
        "shipping-and-launch"
      ];
      skillsToInclude = AGENT_SKILLS.filter(s => coreIds.includes(s.id));
    } else if (agentSkills.mode === "custom" && Array.isArray(agentSkills.selectedSkills)) {
      skillsToInclude = AGENT_SKILLS.filter(s => agentSkills.selectedSkills.includes(s.id));
    }
  }

  // Determine which Design Skills to include
  let designSkillsToInclude = [];
  if (designSuite && designSuite.enabled) {
    if (designSuite.tasteSkill) {
      const s = DESIGN_SKILLS.find(x => x.id === "design-taste-frontend");
      if (s) designSkillsToInclude.push(s);
    }
    if (designSuite.impeccable) {
      const s = DESIGN_SKILLS.find(x => x.id === "impeccable");
      if (s) designSkillsToInclude.push(s);
    }
    if (designSuite.emilAnimations) {
      const s1 = DESIGN_SKILLS.find(x => x.id === "emil-design-eng");
      const s2 = DESIGN_SKILLS.find(x => x.id === "animate");
      if (s1) designSkillsToInclude.push(s1);
      if (s2) designSkillsToInclude.push(s2);
    }
  }

  // Determine which Cybersecurity Skills to include
  let securitySkillsToInclude = [];
  if (cybersecurity && cybersecurity.enabled) {
    if (cybersecurity.appsecAudit) {
      const s = CYBERSECURITY_SKILLS.find(x => x.id === "appsec-code-review");
      if (s) securitySkillsToInclude.push(s);
    }
    if (cybersecurity.threatModeling) {
      const s = CYBERSECURITY_SKILLS.find(x => x.id === "threat-modeling");
      if (s) securitySkillsToInclude.push(s);
    }
    if (cybersecurity.secretScanning) {
      const s = CYBERSECURITY_SKILLS.find(x => x.id === "secret-scanning");
      if (s) securitySkillsToInclude.push(s);
    }
    if (cybersecurity.depAudit) {
      const s = CYBERSECURITY_SKILLS.find(x => x.id === "dependency-vulnerability-audit");
      if (s) securitySkillsToInclude.push(s);
    }
  }

  // -------------------------------------------------------------
  // PER-PROJECT CONFIGURATION
  // -------------------------------------------------------------
  if (scope === "project") {
    // Universal Root AGENTS.md (Recognized by Antigravity, Claude Code, Cursor, Copilot CLI, Qoder)
    files.push({
      path: "AGENTS.md",
      content: consolidatedRulesContent,
      category: "rule",
      description: "Universal AI Agent rules recognized across Antigravity, Claude Code, and other coding agents."
    });

    // Root DESIGN.md if selected
    if (designSuite && designSuite.enabled && designSuite.designMdPreset && designSuite.designMdPreset !== "none") {
      const presetContent = DESIGN_MD_PRESETS[designSuite.designMdPreset] || DESIGN_MD_PRESETS.linear;
      files.push({
        path: "DESIGN.md",
        content: presetContent,
        category: "design",
        description: `Design System Specification (${designSuite.designMdPreset.toUpperCase()}) based on Awesome-Design-MD`
      });
    }

    // Antigravity CLI project files
    if (isAntigravity) {
      files.push({
        path: "GEMINI.md",
        content: consolidatedRulesContent,
        category: "rule",
        description: "Antigravity/Gemini project-level rules file loaded on startup and directory traversal."
      });

      // Addy Osmani skills into .agents/skills/
      for (const skill of skillsToInclude) {
        files.push({
          path: `.agents/skills/${skill.name}/SKILL.md`,
          content: skill.content,
          category: "skill",
          description: `Antigravity Skill: ${skill.title} (${skill.command || "auto-trigger"})`
        });
      }

      // Ponytail rules & skills
      if (ponytail.enabled) {
        files.push({
          path: ".agents/rules/ponytail.md",
          content: PONYTAIL_RULES[ponytail.mode || "full"],
          category: "rule",
          description: `Ponytail lazy senior dev rules (${ponytail.mode || "full"} mode)`
        });

        if (ponytail.includeSkills) {
          for (const pSkill of PONYTAIL_SKILLS) {
            files.push({
              path: `.agents/skills/${pSkill.name}/SKILL.md`,
              content: pSkill.content,
              category: "skill",
              description: `Ponytail Skill: ${pSkill.title}`
            });
          }
        }
      }

      // Headroom Context & Token Compression
      if (headroom && headroom.enabled) {
        if (headroom.includeRules) {
          files.push({
            path: ".agents/rules/headroom.md",
            content: HEADROOM_RULES,
            category: "rule",
            description: "Headroom context & token compression guidelines"
          });
        }
        if (headroom.includeSkill) {
          files.push({
            path: `.agents/skills/${HEADROOM_SKILL.name}/SKILL.md`,
            content: HEADROOM_SKILL.content,
            category: "compression",
            description: `Headroom Skill: ${HEADROOM_SKILL.title} (${HEADROOM_SKILL.command})`
          });
        }
      }

      // Graphify skill & workflows
      if (graphify.enabled) {
        files.push({
          path: ".agents/skills/graphify/SKILL.md",
          content: GRAPHIFY_TEMPLATES.skill,
          category: "skill",
          description: "Graphify Knowledge Graph query & navigation skill for Antigravity"
        });
        files.push({
          path: ".agents/rules/graphify.md",
          content: GRAPHIFY_TEMPLATES.rule,
          category: "rule",
          description: "Guidance rule instructing Antigravity to consult graphify knowledge graph"
        });
        files.push({
          path: ".agents/workflows/graphify.md",
          content: GRAPHIFY_TEMPLATES.workflow,
          category: "workflow",
          description: "Workflow definition for updating and querying graphify"
        });
      }

      // MCP Server Config for Antigravity (Graphify & Headroom)
      const agyMcpServers = {};
      if (graphify.enabled && graphify.includeMcp) {
        agyMcpServers.graphify = {
          command: graphify.mcpCommand === "python" ? "python3" : "uv",
          args: graphify.mcpCommand === "python"
            ? ["-m", "graphify.serve", "${workspace.path}/graphify-out/graph.json"]
            : ["run", "--with", "graphifyy", "--with", "mcp", "-m", "graphify.serve", "${workspace.path}/graphify-out/graph.json"]
        };
      }
      if (headroom && headroom.enabled && headroom.includeMcp) {
        agyMcpServers.headroom = HEADROOM_TEMPLATES.mcpConfigSnippet;
      }
      if (Object.keys(agyMcpServers).length > 0) {
        files.push({
          path: ".agents/mcp_config.json",
          content: JSON.stringify({ mcpServers: agyMcpServers }, null, 2),
          category: "config",
          description: "Antigravity Project MCP server configuration (Graphify & Headroom MCP servers)"
        });
      }
      // Design Skills (Taste-Skill, Impeccable, Emil Kowalski)
      for (const dSkill of designSkillsToInclude) {
        files.push({
          path: `.agents/skills/${dSkill.name}/SKILL.md`,
          content: dSkill.content,
          category: "design",
          description: `Antigravity Design Skill: ${dSkill.title} (${dSkill.command || "auto"})`
        });
      }

      // Cybersecurity & AppSec Skills (Mukul / Trail of Bits / NVIDIA)
      for (const sSkill of securitySkillsToInclude) {
        files.push({
          path: `.agents/skills/${sSkill.name}/SKILL.md`,
          content: sSkill.content,
          category: "security",
          description: `Antigravity Security Skill: ${sSkill.title} (${sSkill.command || "auto"})`
        });
      }
      if (cybersecurity && cybersecurity.enabled) {
        files.push({
          path: ".agents/rules/security.md",
          content: CYBERSECURITY_RULES,
          category: "rule",
          description: "Antigravity Cybersecurity & OWASP defensive guidelines"
        });
      }
    }

    // Claude Code CLI project files
    if (isClaude) {
      files.push({
        path: "CLAUDE.md",
        content: consolidatedRulesContent,
        category: "rule",
        description: "Claude Code CLI project guidelines and instructions file."
      });

      // Claude skills in .claude/skills/
      for (const skill of skillsToInclude) {
        files.push({
          path: `.claude/skills/${skill.name}/SKILL.md`,
          content: skill.content,
          category: "skill",
          description: `Claude Code Skill: ${skill.title} (${skill.command || "auto-trigger"})`
        });
      }

      // Design Skills for Claude Code
      for (const dSkill of designSkillsToInclude) {
        files.push({
          path: `.claude/skills/${dSkill.name}/SKILL.md`,
          content: dSkill.content,
          category: "design",
          description: `Claude Code Design Skill: ${dSkill.title} (${dSkill.command || "auto"})`
        });
      }

      // Cybersecurity Skills for Claude Code
      for (const sSkill of securitySkillsToInclude) {
        files.push({
          path: `.claude/skills/${sSkill.name}/SKILL.md`,
          content: sSkill.content,
          category: "security",
          description: `Claude Code Security Skill: ${sSkill.title} (${sSkill.command || "auto"})`
        });
      }

      if (ponytail.enabled && ponytail.includeSkills) {
        for (const pSkill of PONYTAIL_SKILLS) {
          files.push({
            path: `.claude/skills/${pSkill.name}/SKILL.md`,
            content: pSkill.content,
            category: "skill",
            description: `Claude Code Skill: ${pSkill.title}`
          });
        }
      }

      // Headroom for Claude Code
      if (headroom && headroom.enabled && headroom.includeSkill) {
        files.push({
          path: `.claude/skills/${HEADROOM_SKILL.name}/SKILL.md`,
          content: HEADROOM_SKILL.content,
          category: "compression",
          description: `Claude Code Skill: ${HEADROOM_SKILL.title} (${HEADROOM_SKILL.command})`
        });
      }

      if (graphify.enabled) {
        files.push({
          path: ".claude/skills/graphify/SKILL.md",
          content: GRAPHIFY_TEMPLATES.skill,
          category: "skill",
          description: "Claude Code Graphify Knowledge Graph skill"
        });
      }

      // Claude MCP Servers (Graphify & Headroom)
      const claudeMcpServers = {};
      if (graphify.enabled && graphify.includeMcp) {
        claudeMcpServers.graphify = {
          command: graphify.mcpCommand === "python" ? "python3" : "uv",
          args: graphify.mcpCommand === "python"
            ? ["-m", "graphify.serve", "${workspace.path}/graphify-out/graph.json"]
            : ["run", "--with", "graphifyy", "--with", "mcp", "-m", "graphify.serve", "${workspace.path}/graphify-out/graph.json"]
        };
      }
      if (headroom && headroom.enabled && headroom.includeMcp) {
        claudeMcpServers.headroom = HEADROOM_TEMPLATES.mcpConfigSnippet;
      }
      if (Object.keys(claudeMcpServers).length > 0) {
        files.push({
          path: ".claude/settings.json",
          content: JSON.stringify({ mcpServers: claudeMcpServers }, null, 2),
          category: "config",
          description: "Claude Code settings with MCP server configuration (Graphify & Headroom)"
        });
      }
    }

    // Generate repeatable setup script
    files.push({
      path: "setup-ai-environment.sh",
      content: generateSetupScript({
        isAntigravity,
        isClaude,
        ponytail,
        headroom,
        graphify,
        agentSkills,
        designSuite,
        cybersecurity
      }),
      category: "script",
      description: "Executable Bash script to install all CLI extensions and dependencies."
    });
  }

  // -------------------------------------------------------------
  // UNIVERSAL / GLOBAL CONFIGURATION
  // -------------------------------------------------------------
  if (scope === "global") {
    if (isAntigravity) {
      files.push({
        path: "~/.gemini/config/GEMINI.md",
        content: consolidatedRulesContent,
        category: "rule",
        description: "Global Antigravity rules applied across every workspace on this machine."
      });

      for (const skill of skillsToInclude) {
        files.push({
          path: `~/.gemini/config/skills/${skill.name}/SKILL.md`,
          content: skill.content,
          category: "skill",
          description: `Global Antigravity Skill: ${skill.title}`
        });
      }

      for (const dSkill of designSkillsToInclude) {
        files.push({
          path: `~/.gemini/config/skills/${dSkill.name}/SKILL.md`,
          content: dSkill.content,
          category: "design",
          description: `Global Antigravity Design Skill: ${dSkill.title}`
        });
      }

      for (const sSkill of securitySkillsToInclude) {
        files.push({
          path: `~/.gemini/config/skills/${sSkill.name}/SKILL.md`,
          content: sSkill.content,
          category: "security",
          description: `Global Antigravity Security Skill: ${sSkill.title}`
        });
      }

      if (headroom && headroom.enabled && headroom.includeSkill) {
        files.push({
          path: `~/.gemini/config/skills/${HEADROOM_SKILL.name}/SKILL.md`,
          content: HEADROOM_SKILL.content,
          category: "compression",
          description: `Global Antigravity Skill: ${HEADROOM_SKILL.title}`
        });
      }

      if (graphify.enabled) {
        files.push({
          path: "~/.gemini/config/skills/graphify/SKILL.md",
          content: GRAPHIFY_TEMPLATES.skill,
          category: "skill",
          description: "Global Antigravity Graphify skill"
        });
      }

      // Global Antigravity MCP Server definition (Graphify & Headroom)
      const globalAgyMcp = {};
      if (graphify.enabled && graphify.includeMcp) {
        globalAgyMcp.graphify = GRAPHIFY_TEMPLATES.mcpConfigSnippet;
      }
      if (headroom && headroom.enabled && headroom.includeMcp) {
        globalAgyMcp.headroom = HEADROOM_TEMPLATES.mcpConfigSnippet;
      }
      if (Object.keys(globalAgyMcp).length > 0) {
        files.push({
          path: "~/.gemini/antigravity/mcp_config.json",
          content: JSON.stringify({ mcpServers: globalAgyMcp }, null, 2),
          category: "config",
          description: "Global Antigravity MCP Server definition"
        });
      }
    }

    if (isClaude) {
      files.push({
        path: "~/.claude/CLAUDE.md",
        content: consolidatedRulesContent,
        category: "rule",
        description: "Global Claude Code instructions applied to all sessions."
      });

      for (const skill of skillsToInclude) {
        files.push({
          path: `~/.claude/skills/${skill.name}/SKILL.md`,
          content: skill.content,
          category: "skill",
          description: `Global Claude Code Skill: ${skill.title}`
        });
      }

      for (const dSkill of designSkillsToInclude) {
        files.push({
          path: `~/.claude/skills/${dSkill.name}/SKILL.md`,
          content: dSkill.content,
          category: "design",
          description: `Global Claude Code Design Skill: ${dSkill.title}`
        });
      }

      for (const sSkill of securitySkillsToInclude) {
        files.push({
          path: `~/.claude/skills/${sSkill.name}/SKILL.md`,
          content: sSkill.content,
          category: "security",
          description: `Global Claude Code Security Skill: ${sSkill.title}`
        });
      }

      if (headroom && headroom.enabled && headroom.includeSkill) {
        files.push({
          path: `~/.claude/skills/${HEADROOM_SKILL.name}/SKILL.md`,
          content: HEADROOM_SKILL.content,
          category: "compression",
          description: `Global Claude Code Skill: ${HEADROOM_SKILL.title}`
        });
      }

      if (graphify.enabled) {
        files.push({
          path: "~/.claude/skills/graphify/SKILL.md",
          content: GRAPHIFY_TEMPLATES.skill,
          category: "skill",
          description: "Global Claude Code Graphify skill"
        });
      }
    }

    files.push({
      path: "install-global-ai-tools.sh",
      content: generateGlobalInstallScript({
        isAntigravity,
        isClaude,
        ponytail,
        headroom,
        graphify,
        agentSkills,
        designSuite,
        cybersecurity
      }),
      category: "script",
      description: "Shell script to install plugins and packages globally for Claude and Antigravity."
    });
  }

  return files;
}

/**
 * Generate project-level executable bash script
 */
function generateSetupScript({ isAntigravity, isClaude, ponytail, headroom, graphify, agentSkills, designSuite, cybersecurity }) {
  return `#!/usr/bin/env bash
# ==============================================================================
# AI Agent Environment Setup Script (Project-Level)
# Configures Antigravity CLI and/or Claude Code CLI with:
# - Addy Osmani Agent Skills
# - Dietrich Gebert's Ponytail
# - Headroom Context & Token Compression
# - Graphify Knowledge Graph
# - Design & UI Engineering Skills (Taste, Impeccable, Emil Kowalski)
# - Cybersecurity & AppSec Skills
# ==============================================================================

set -e

echo "==> Setting up AI Agent Environment for current project..."

# 1. Addy Osmani Agent Skills
${agentSkills.enabled ? `
echo "==> [1/6] Setting up Agent Skills (addyosmani/agent-skills)..."
if command -v npx >/dev/null 2>&1; then
  echo "Running npx skills to ensure ecosystem synchronization..."
  # npx skills add addyosmani/agent-skills --yes || echo "npx skills finished (local skill files are already in place)."
fi
` : "# Agent skills skipped"}

# 2. Dietrich Gebert's Ponytail
${ponytail.enabled ? `
echo "==> [2/6] Configuring Ponytail (Lazy Senior Dev Mode)..."
${isAntigravity ? `
if command -v agy >/dev/null 2>&1; then
  echo "Installing Ponytail plugin in Antigravity CLI..."
  agy plugin install https://github.com/DietrichGebert/ponytail || echo "Antigravity plugin registration completed."
fi
` : ""}
${isClaude ? `
echo "For Claude Code CLI, Ponytail rules are active in CLAUDE.md / AGENTS.md."
echo "Optional marketplace install: /plugin marketplace add DietrichGebert/ponytail"
` : ""}
` : "# Ponytail skipped"}

# 3. Headroom Context & Token Compression
${headroom && headroom.enabled ? `
echo "==> [3/6] Setting up Headroom (Context & Token Compression)..."
if command -v uv >/dev/null 2>&1; then
  echo "Installing Headroom CLI tool via uv..."
  uv tool install "headroom-ai[all]" || echo "uv tool install headroom-ai completed or already installed."
elif command -v pip >/dev/null 2>&1 || command -v pip3 >/dev/null 2>&1; then
  pip install --upgrade "headroom-ai[all]" || pip3 install --upgrade "headroom-ai[all]"
fi
` : "# Headroom skipped"}

# 4. Graphify
${graphify.enabled ? `
echo "==> [4/6] Setting up Graphify Knowledge Graph..."
if command -v pip >/dev/null 2>&1 || command -v pip3 >/dev/null 2>&1; then
  echo "Installing graphifyy package via pip..."
  pip install --upgrade graphifyy || pip3 install --upgrade graphifyy
  echo "To build your initial codebase graph, run:"
  echo "  graphify ."
fi
` : "# Graphify skipped"}

# 5. Design & Frontend UI Engineering Skills
${designSuite && designSuite.enabled ? `
echo "==> [5/6] Setting up Design Skills (Taste-Skill, Impeccable, Emil Kowalski)..."
if command -v npx >/dev/null 2>&1; then
  ${designSuite.tasteSkill ? 'npx skills add https://github.com/Leonxlnx/taste-skill --yes || true' : ''}
  ${designSuite.impeccable ? 'npx skills add https://github.com/pbakaus/impeccable --yes || true' : ''}
  ${designSuite.emilAnimations ? 'npx skills add https://github.com/emilkowalski/skills --yes || true' : ''}
fi
` : "# Design suite skipped"}

# 6. Cybersecurity & AppSec Skills
${cybersecurity && cybersecurity.enabled ? `
echo "==> [6/6] Setting up Cybersecurity & AppSec Skills (Anthropic Cybersecurity, Trail of Bits)..."
if command -v npx >/dev/null 2>&1; then
  npx skills add https://github.com/mukul975/Anthropic-Cybersecurity-Skills --yes || true
  npx skills add https://github.com/trailofbits/skills --yes || true
fi
` : "# Cybersecurity suite skipped"}

echo ""
echo "✅ AI Agent Project Configuration Ready!"
echo "Files configured:"
echo "  - AGENTS.md & GEMINI.md / CLAUDE.md"
echo "  - .agents/skills/ & .claude/skills/"
echo "  - .agents/rules/ & mcp_config.json"
echo ""
echo "Try running:"
${isAntigravity ? 'echo "  agy                 # Start Antigravity CLI"' : ""}
${isClaude ? 'echo "  claude              # Start Claude Code CLI"' : ""}
`;
}

/**
 * Generate machine-global install script
 */
function generateGlobalInstallScript({ isAntigravity, isClaude, ponytail, headroom, graphify, agentSkills, designSuite, cybersecurity }) {
  return `#!/usr/bin/env bash
# ==============================================================================
# Universal / Global AI Tools Installation Script
# Installs packages, global skills, and plugins machine-wide
# ==============================================================================

set -e

echo "==> Running Universal AI Tools Setup..."

# 1. Addy Osmani Skills globally
${agentSkills.enabled ? `
echo "Installing Agent Skills globally via npx..."
npx skills add addyosmani/agent-skills --global --yes || true
` : ""}

# 2. Ponytail globally
${ponytail.enabled ? `
${isAntigravity ? `
if command -v agy >/dev/null 2>&1; then
  echo "Installing Ponytail plugin into Antigravity globally..."
  agy plugin install https://github.com/DietrichGebert/ponytail
fi
` : ""}
${isClaude ? `
echo "In Claude Code CLI session, run:"
echo "  /plugin marketplace add DietrichGebert/ponytail"
echo "  /plugin install ponytail@ponytail"
` : ""}
` : ""}

# 3. Headroom globally
${headroom && headroom.enabled ? `
echo "Installing Headroom globally via uv..."
if command -v uv >/dev/null 2>&1; then
  uv tool install "headroom-ai[all]" || true
elif command -v pip >/dev/null 2>&1 || command -v pip3 >/dev/null 2>&1; then
  pip install --upgrade "headroom-ai[all]" || pip3 install --upgrade "headroom-ai[all]"
fi
` : ""}

# 4. Graphify globally
${graphify.enabled ? `
echo "Installing Graphify globally..."
pip install --upgrade graphifyy || pip3 install --upgrade graphifyy
${isAntigravity ? `
echo "Registering Graphify skill for Antigravity..."
graphify install --platform antigravity || true
` : ""}
${isClaude ? `
echo "Registering Graphify skill for Claude Code..."
graphify install --platform claude || true
` : ""}
` : ""}

# 5. Design Skills globally
${designSuite && designSuite.enabled ? `
echo "Installing Design Skills globally via npx..."
${designSuite.tasteSkill ? 'npx skills add https://github.com/Leonxlnx/taste-skill --global --yes || true' : ''}
${designSuite.impeccable ? 'npx skills add https://github.com/pbakaus/impeccable --global --yes || true' : ''}
${designSuite.emilAnimations ? 'npx skills add https://github.com/emilkowalski/skills --global --yes || true' : ''}
` : ""}

# 6. Cybersecurity Skills globally
${cybersecurity && cybersecurity.enabled ? `
echo "Installing Cybersecurity Skills globally via npx..."
npx skills add https://github.com/mukul975/Anthropic-Cybersecurity-Skills --global --yes || true
npx skills add https://github.com/trailofbits/skills --global --yes || true
` : ""}

echo ""
echo "✅ Universal setup completed!"
`;
}
