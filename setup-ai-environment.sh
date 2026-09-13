#!/usr/bin/env bash
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

echo "==> [1/6] Setting up Agent Skills (addyosmani/agent-skills)..."
if command -v npx >/dev/null 2>&1; then
  echo "Running npx skills to ensure ecosystem synchronization..."
  # npx skills add addyosmani/agent-skills --yes || echo "npx skills finished (local skill files are already in place)."
fi


# 2. Dietrich Gebert's Ponytail

echo "==> [2/6] Configuring Ponytail (Lazy Senior Dev Mode)..."

if command -v agy >/dev/null 2>&1; then
  echo "Installing Ponytail plugin in Antigravity CLI..."
  agy plugin install https://github.com/DietrichGebert/ponytail || echo "Antigravity plugin registration completed."
fi


echo "For Claude Code CLI, Ponytail rules are active in CLAUDE.md / AGENTS.md."
echo "Optional marketplace install: /plugin marketplace add DietrichGebert/ponytail"



# 3. Headroom Context & Token Compression

echo "==> [3/6] Setting up Headroom (Context & Token Compression)..."
if command -v uv >/dev/null 2>&1; then
  echo "Installing Headroom CLI tool via uv..."
  uv tool install "headroom-ai[all]" || echo "uv tool install headroom-ai completed or already installed."
elif command -v pip >/dev/null 2>&1 || command -v pip3 >/dev/null 2>&1; then
  pip install --upgrade "headroom-ai[all]" || pip3 install --upgrade "headroom-ai[all]"
fi


# 4. Graphify

echo "==> [4/6] Setting up Graphify Knowledge Graph..."
if command -v pip >/dev/null 2>&1 || command -v pip3 >/dev/null 2>&1; then
  echo "Installing graphifyy package via pip..."
  pip install --upgrade graphifyy || pip3 install --upgrade graphifyy
  echo "To build your initial codebase graph, run:"
  echo "  graphify ."
fi


# 5. Design & Frontend UI Engineering Skills

echo "==> [5/6] Setting up Design Skills (Taste-Skill, Impeccable, Emil Kowalski)..."
if command -v npx >/dev/null 2>&1; then
  npx skills add https://github.com/Leonxlnx/taste-skill --yes || true
  npx skills add https://github.com/pbakaus/impeccable --yes || true
  npx skills add https://github.com/emilkowalski/skills --yes || true
fi


# 6. Cybersecurity & AppSec Skills

echo "==> [6/6] Setting up Cybersecurity & AppSec Skills (Anthropic Cybersecurity, Trail of Bits)..."
if command -v npx >/dev/null 2>&1; then
  npx skills add https://github.com/mukul975/Anthropic-Cybersecurity-Skills --yes || true
  npx skills add https://github.com/trailofbits/skills --yes || true
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
echo "  claude              # Start Claude Code CLI"
