#!/usr/bin/env bash
# ==============================================================================
# Universal / Global AI Tools Installation Script
# Installs packages, global skills, and plugins machine-wide
# ==============================================================================

set -e

echo "==> Running Universal AI Tools Setup..."

# 1. Addy Osmani Skills globally

echo "Installing Agent Skills globally via npx..."
npx skills add addyosmani/agent-skills --global --yes || true


# 2. Ponytail globally


if command -v agy >/dev/null 2>&1; then
  echo "Installing Ponytail plugin into Antigravity globally..."
  agy plugin install https://github.com/DietrichGebert/ponytail
fi


echo "In Claude Code CLI session, run:"
echo "  /plugin marketplace add DietrichGebert/ponytail"
echo "  /plugin install ponytail@ponytail"



# 3. Graphify globally

echo "Installing Graphify globally..."
pip install --upgrade graphifyy || pip3 install --upgrade graphifyy

echo "Registering Graphify skill for Antigravity..."
graphify install --platform antigravity || true


echo "Registering Graphify skill for Claude Code..."
graphify install --platform claude || true



echo ""
echo "✅ Universal setup completed!"
