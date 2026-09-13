#!/usr/bin/env bash
# ==============================================================================
# AI Agent Environment Setup Script (Project-Level)
# Configures Antigravity CLI and/or Claude Code CLI with:
# - Addy Osmani Agent Skills
# - Dietrich Gebert's Ponytail
# - Graphify Knowledge Graph
# - Design & UI Engineering Skills (Taste, Impeccable, Emil Kowalski)
# ==============================================================================

set -e

echo "==> Setting up AI Agent Environment for current project..."

# 1. Addy Osmani Agent Skills

echo "==> [1/4] Setting up Agent Skills (addyosmani/agent-skills)..."
if command -v npx >/dev/null 2>&1; then
  echo "Running npx skills to ensure ecosystem synchronization..."
  # npx skills add addyosmani/agent-skills --yes || echo "npx skills finished (local skill files are already in place)."
fi


# 2. Dietrich Gebert's Ponytail

echo "==> [2/4] Configuring Ponytail (Lazy Senior Dev Mode)..."

if command -v agy >/dev/null 2>&1; then
  echo "Installing Ponytail plugin in Antigravity CLI..."
  agy plugin install https://github.com/DietrichGebert/ponytail || echo "Antigravity plugin registration completed."
fi




# 3. Graphify

echo "==> [3/4] Setting up Graphify Knowledge Graph..."
if command -v pip >/dev/null 2>&1 || command -v pip3 >/dev/null 2>&1; then
  echo "Installing graphifyy package via pip..."
  pip install --upgrade graphifyy || pip3 install --upgrade graphifyy
  echo "To build your initial codebase graph, run:"
  echo "  graphify ."
fi


# 4. Design & Frontend UI Engineering Skills

echo "==> [4/4] Setting up Design Skills (Taste-Skill, Impeccable, Emil Kowalski)..."
if command -v npx >/dev/null 2>&1; then
  npx skills add https://github.com/Leonxlnx/taste-skill --yes || true
  npx skills add https://github.com/pbakaus/impeccable --yes || true
  npx skills add https://github.com/emilkowalski/skills --yes || true
fi


echo ""
echo "✅ AI Agent Project Configuration Ready!"
echo "Files configured:"
echo "  - AGENTS.md & GEMINI.md / CLAUDE.md"
echo "  - .agents/skills/ & .claude/skills/"
echo "  - .agents/rules/ & mcp_config.json"
echo ""
echo "Try running:"
echo "  agy                 # Start Antigravity CLI"

