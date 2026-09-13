// public/app.js - Frontend application logic for AI Agent Configurator

// Global State
const state = {
  targetDir: "",
  targetCli: "both",
  scope: "project",
  agentSkills: {
    enabled: true,
    mode: "core",
    selectedSkills: []
  },
  ponytail: {
    enabled: true,
    mode: "full",
    includeSkills: true
  },
  headroom: {
    enabled: true,
    includeMcp: true,
    includeSkill: true,
    includeRules: true
  },
  graphify: {
    enabled: true,
    includeMcp: true,
    mcpCommand: "uv"
  },
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
  },
  projectRules: {
    stack: "typescript",
    testCoverage: true,
    gitCommitConventions: true,
    customRules: ""
  },
  catalog: null,
  previewFiles: [],
  selectedFileIndex: 0,
  savedProjects: [],
  fsBrowser: {
    currentPath: "",
    parentPath: null
  }
};

// Helper: Escape HTML strings
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Helper: Compute local relative route within project
function getLocalRoute(relativePath) {
  if (!relativePath) return "";
  const cleanRel = relativePath.replace(/^[/\\]+/, "");
  return `./${cleanRel}`;
}

// Alias
function getFullRoute(relativePath) {
  return getLocalRoute(relativePath);
}

// Floating Route Tooltip Logic
function showRouteTooltip(e, fullRoute, category) {
  if (!el.floatingRouteTooltip || !el.tooltipRoutePath) return;
  
  el.tooltipRoutePath.textContent = fullRoute;
  if (el.tooltipRouteCat) {
    el.tooltipRouteCat.textContent = (category || "FILE").toUpperCase();
  }
  
  el.floatingRouteTooltip.classList.remove("hidden");
  positionRouteTooltip(e);
  requestAnimationFrame(() => {
    if (el.floatingRouteTooltip) {
      el.floatingRouteTooltip.classList.remove("opacity-0");
      el.floatingRouteTooltip.classList.add("opacity-100");
    }
  });
}

function positionRouteTooltip(e) {
  if (!el.floatingRouteTooltip) return;
  const tooltip = el.floatingRouteTooltip;
  const padding = 16;
  const tooltipWidth = tooltip.offsetWidth || 380;
  const tooltipHeight = tooltip.offsetHeight || 60;

  let x = e.clientX + 14;
  let y = e.clientY + 14;

  if (x + tooltipWidth > window.innerWidth - padding) {
    x = e.clientX - tooltipWidth - 14;
  }
  if (y + tooltipHeight > window.innerHeight - padding) {
    y = e.clientY - tooltipHeight - 14;
  }
  if (x < padding) x = padding;
  if (y < padding) y = padding;

  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
}

function moveRouteTooltip(e) {
  if (!el.floatingRouteTooltip || el.floatingRouteTooltip.classList.contains("hidden")) return;
  positionRouteTooltip(e);
}

function hideRouteTooltip() {
  if (!el.floatingRouteTooltip) return;
  el.floatingRouteTooltip.classList.add("opacity-0");
  el.floatingRouteTooltip.classList.remove("opacity-100");
  setTimeout(() => {
    if (el.floatingRouteTooltip && el.floatingRouteTooltip.classList.contains("opacity-0")) {
      el.floatingRouteTooltip.classList.add("hidden");
    }
  }, 120);
}

// DOM Elements
const el = {
  badgeNode: document.getElementById("badge-node"),
  badgePython: document.getElementById("badge-python"),
  badgeAgy: document.getElementById("badge-agy"),
  badgeClaude: document.getElementById("badge-claude"),
  targetDirInput: document.getElementById("target-dir-input"),
  btnBrowseFolder: document.getElementById("btn-browse-folder"),
  btnSavedProjectsToggle: document.getElementById("btn-saved-projects-toggle"),
  savedProjectsCount: document.getElementById("saved-projects-count"),
  btnBookmarkCurrent: document.getElementById("btn-bookmark-current"),
  btnInspect: document.getElementById("btn-inspect"),
  btnCurrentDir: document.getElementById("btn-current-dir"),
  dirStatusBadge: document.getElementById("dir-status-badge"),
  cliBtns: document.querySelectorAll(".cli-btn"),
  scopeBtns: document.querySelectorAll(".scope-btn"),
  skillsEnabled: document.getElementById("skills-enabled"),
  skillsControls: document.getElementById("skills-controls"),
  skillPresetBtns: document.querySelectorAll(".skill-preset-btn"),
  skillsChipList: document.getElementById("skills-chip-list"),
  ponytailEnabled: document.getElementById("ponytail-enabled"),
  ponytailControls: document.getElementById("ponytail-controls"),
  ponytailModeBtns: document.querySelectorAll(".ponytail-mode-btn"),
  ponytailSkillsCheckbox: document.getElementById("ponytail-skills-checkbox"),
  headroomEnabled: document.getElementById("headroom-enabled"),
  headroomControls: document.getElementById("headroom-controls"),
  headroomMcpCheckbox: document.getElementById("headroom-mcp-checkbox"),
  headroomSkillCheckbox: document.getElementById("headroom-skill-checkbox"),
  headroomRulesCheckbox: document.getElementById("headroom-rules-checkbox"),
  graphifyEnabled: document.getElementById("graphify-enabled"),
  graphifyControls: document.getElementById("graphify-controls"),
  graphifyMcpCheckbox: document.getElementById("graphify-mcp-checkbox"),
  mcpRunnerRadios: document.querySelectorAll('input[name="mcp-runner"]'),
  designEnabled: document.getElementById("design-enabled"),
  designControls: document.getElementById("design-controls"),
  designTasteCheckbox: document.getElementById("design-taste-checkbox"),
  designImpeccableCheckbox: document.getElementById("design-impeccable-checkbox"),
  designEmilCheckbox: document.getElementById("design-emil-checkbox"),
  designMdSelect: document.getElementById("design-md-select"),
  dialVariance: document.getElementById("dial-variance"),
  dialMotion: document.getElementById("dial-motion"),
  dialDensity: document.getElementById("dial-density"),
  labelVariance: document.getElementById("label-variance"),
  labelMotion: document.getElementById("label-motion"),
  labelDensity: document.getElementById("label-density"),
  securityEnabled: document.getElementById("security-enabled"),
  securityControls: document.getElementById("security-controls"),
  secAppsecCheckbox: document.getElementById("sec-appsec-checkbox"),
  secThreatCheckbox: document.getElementById("sec-threat-checkbox"),
  secSecretCheckbox: document.getElementById("sec-secret-checkbox"),
  secDepCheckbox: document.getElementById("sec-dep-checkbox"),
  stackSelect: document.getElementById("stack-select"),
  ruleTests: document.getElementById("rule-tests"),
  ruleCommits: document.getElementById("rule-commits"),
  customRulesText: document.getElementById("custom-rules-text"),
  tabBtns: document.querySelectorAll(".tab-btn"),
  tabPanels: document.querySelectorAll(".tab-panel"),
  previewCountBadge: document.getElementById("preview-count-badge"),
  totalSizeLabel: document.getElementById("total-size-label"),
  filesTreeList: document.getElementById("files-tree-list"),
  viewerFilePath: document.getElementById("viewer-file-path"),
  viewerFileTag: document.getElementById("viewer-file-tag"),
  viewerCodeContent: document.getElementById("viewer-code-content"),
  btnCopyCode: document.getElementById("btn-copy-code"),
  btnApplyQuick: document.getElementById("btn-apply-quick"),
  btnApplyAction: document.getElementById("btn-apply-action"),
  btnRunInstallScript: document.getElementById("btn-run-install-script"),
  customCmdInput: document.getElementById("custom-cmd-input"),
  btnRunCmd: document.getElementById("btn-run-cmd"),
  btnClearTerminal: document.getElementById("btn-clear-terminal"),
  terminalScreen: document.getElementById("terminal-screen"),
  toast: document.getElementById("toast"),
  toastMsg: document.getElementById("toast-msg"),
  toastIconContainer: document.getElementById("toast-icon-container"),

  // Route indicator & Tooltip elements
  treeHoverRouteBar: document.getElementById("tree-hover-route-bar"),
  treeHoverRouteText: document.getElementById("tree-hover-route-text"),
  btnCopyRoute: document.getElementById("btn-copy-route"),
  floatingRouteTooltip: document.getElementById("floating-route-tooltip"),
  tooltipRoutePath: document.getElementById("tooltip-route-path"),
  tooltipRouteCat: document.getElementById("tooltip-route-cat"),

  // Saved Projects Modal Elements
  modalSavedProjects: document.getElementById("modal-saved-projects"),
  modalSpClose: document.getElementById("modal-sp-close"),
  modalSpBtnDismiss: document.getElementById("modal-sp-btn-dismiss"),
  spFormTitle: document.getElementById("sp-form-title"),
  spIdInput: document.getElementById("sp-id-input"),
  spNameInput: document.getElementById("sp-name-input"),
  spPathInput: document.getElementById("sp-path-input"),
  spBtnSave: document.getElementById("sp-btn-save"),
  spBtnSaveLabel: document.getElementById("sp-btn-save-label"),
  spBtnCancelEdit: document.getElementById("sp-btn-cancel-edit"),
  savedProjectsListContainer: document.getElementById("saved-projects-list-container"),

  // FS Browser Modal Elements
  modalFsBrowser: document.getElementById("modal-fs-browser"),
  modalFsClose: document.getElementById("modal-fs-close"),
  modalFsBtnCancel: document.getElementById("modal-fs-btn-cancel"),
  fsBtnParent: document.getElementById("fs-btn-parent"),
  fsCurrentPathInput: document.getElementById("fs-current-path-input"),
  fsBtnGo: document.getElementById("fs-btn-go"),
  fsDirsContainer: document.getElementById("fs-dirs-container"),
  fsSelectedHint: document.getElementById("fs-selected-hint"),
  fsBtnConfirmSelect: document.getElementById("fs-btn-confirm-select"),

  // Layout Columns
  configControlsCol: document.getElementById("config-controls-col"),
  workspaceTabsCol: document.getElementById("workspace-tabs-col"),

  // Awesome-Design-MD Themes Gallery Elements
  btnOpenThemesTab: document.getElementById("btn-open-themes-tab"),
  btnBackToConfig: document.getElementById("btn-back-to-config"),
  themesGridContainer: document.getElementById("themes-grid-container"),
  themesSearchInput: document.getElementById("themes-search-input"),
  galleryActiveThemeBadge: document.getElementById("gallery-active-theme-badge"),
  themeFilterBtns: document.querySelectorAll(".theme-filter-btn"),
  modalThemePreview: document.getElementById("modal-theme-preview"),
  modalThemeTitle: document.getElementById("modal-theme-title"),
  modalThemeCode: document.getElementById("modal-theme-code"),
  modalThemeClose: document.getElementById("modal-theme-close"),
  modalThemeCopy: document.getElementById("modal-theme-copy"),
  modalThemeActivate: document.getElementById("modal-theme-activate"),
  modalThemeDesc: document.getElementById("modal-theme-desc"),
  modalThemeTagBadge: document.getElementById("modal-theme-tag-badge"),
  modalThemeStarsBadge: document.getElementById("modal-theme-stars-badge"),
  modalThemeIcon: document.getElementById("modal-theme-icon"),
  modalThemeIconBox: document.getElementById("modal-theme-icon-box"),
  modalTabBtnStudio: document.getElementById("modal-tab-btn-studio"),
  modalTabBtnMarkdown: document.getElementById("modal-tab-btn-markdown"),
  modalPaneStudio: document.getElementById("modal-pane-studio"),
  modalPaneMarkdown: document.getElementById("modal-pane-markdown"),
  modalThemeCopyCss: document.getElementById("modal-theme-copy-css"),
  modalThemeStatusNote: document.getElementById("modal-theme-status-note")
};

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
  populateDesignSelectOptions();
  renderThemesGallery();
  await loadEnvironment();
  await loadCatalog();
  await loadSavedProjects();
  await setDefaultTargetDir();
  triggerPreview();
  if (window.lucide) lucide.createIcons();
});

// Load System Environment
async function loadEnvironment() {
  try {
    const res = await fetch("/api/environment");
    const json = await res.json();
    if (json.ok) {
      const { binaries } = json.data;
      if (binaries.node.available) {
        el.badgeNode.textContent = `node: ${binaries.node.version.replace("v", "")}`;
      }
      if (binaries.python3.available) {
        el.badgePython.textContent = binaries.python3.version.replace("Python ", "py: ");
      }
      if (binaries.agy.available) {
        el.badgeAgy.textContent = `agy: ${binaries.agy.version}`;
        el.badgeAgy.parentElement.classList.add("border-blue-500/50", "bg-blue-500/10");
      } else {
        el.badgeAgy.textContent = "agy: nelocalizat";
      }
      if (binaries.claude.available) {
        el.badgeClaude.textContent = `claude: ${binaries.claude.version}`;
        el.badgeClaude.parentElement.classList.add("border-amber-500/50", "bg-amber-500/10");
      } else {
        el.badgeClaude.textContent = "claude: nelocalizat";
      }
    }
  } catch (err) {
    console.error("Failed to load environment:", err);
  }
}

// Load Skills Catalog
async function loadCatalog() {
  try {
    const res = await fetch("/api/skills-catalog");
    const json = await res.json();
    if (json.ok) {
      state.catalog = json.data;
      renderSkillsList();
      renderThemesGallery();
    }
  } catch (err) {
    console.error("Failed to load catalog:", err);
  }
}

// Set default target directory
async function setDefaultTargetDir() {
  try {
    const res = await fetch("/api/inspect-path", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetDir: "" })
    });
    const json = await res.json();
    if (json.ok) {
      state.targetDir = json.data.targetDir;
      el.targetDirInput.value = state.targetDir;
      updateDirectoryBadge(json.data);
    }
  } catch (err) {
    console.error("Failed to inspect initial dir:", err);
  }
}

// Render Skills in UI
function renderSkillsList() {
  if (!state.catalog || !state.catalog.agentSkills) return;
  el.skillsChipList.innerHTML = "";

  const coreIds = [
    "spec-driven-development",
    "planning-and-task-breakdown",
    "incremental-implementation",
    "test-driven-development",
    "code-review-and-quality",
    "code-simplification",
    "shipping-and-launch"
  ];

  state.catalog.agentSkills.forEach(skill => {
    const isCore = coreIds.includes(skill.id);
    let isChecked = false;

    if (state.agentSkills.mode === "all") isChecked = true;
    else if (state.agentSkills.mode === "core") isChecked = isCore;
    else if (state.agentSkills.mode === "custom") {
      isChecked = state.agentSkills.selectedSkills.includes(skill.id);
    }

    const item = document.createElement("label");
    item.className = `flex items-center justify-between p-2.5 rounded-sm cursor-pointer transition ${
      isChecked ? "bg-zinc-100 border border-zinc-300 text-zinc-950 font-medium" : "hover:bg-zinc-50 text-zinc-600 border border-transparent"
    }`;

    item.innerHTML = `
      <div class="flex items-center gap-2.5">
        <input type="checkbox" value="${skill.id}" class="skill-checkbox accent-zinc-900 rounded-sm" ${isChecked ? "checked" : ""}>
        <span class="font-medium text-xs text-zinc-900">${skill.title}</span>
      </div>
      <span class="font-mono text-[10px] text-zinc-700 bg-zinc-200/80 px-1.5 py-0.5 rounded-sm border border-zinc-300">${skill.command || "auto"}</span>
    `;

    const targetCli = state.targetCli;
    const relPath = (targetCli === "claude") 
      ? `.claude/skills/${skill.id}/SKILL.md` 
      : `.agents/skills/${skill.id}/SKILL.md`;
    const fullRoute = getFullRoute(relPath);

    item.title = `Ruta locală: ${fullRoute}`;
    item.addEventListener("mouseenter", (e) => {
      showRouteTooltip(e, fullRoute, "SKILL");
    });
    item.addEventListener("mousemove", (e) => {
      moveRouteTooltip(e);
    });
    item.addEventListener("mouseleave", () => {
      hideRouteTooltip();
    });

    const checkbox = item.querySelector(".skill-checkbox");
    checkbox.addEventListener("change", (e) => {
      state.agentSkills.mode = "custom";
      updatePresetButtonUI("custom");
      syncSelectedSkillsFromUI();
      triggerPreview();
    });

    el.skillsChipList.appendChild(item);
  });
}

function syncSelectedSkillsFromUI() {
  const checkboxes = el.skillsChipList.querySelectorAll(".skill-checkbox:checked");
  state.agentSkills.selectedSkills = Array.from(checkboxes).map(cb => cb.value);
}

function updatePresetButtonUI(preset) {
  el.skillPresetBtns.forEach(btn => {
    if (btn.dataset.preset === preset) {
      btn.classList.add("active", "bg-zinc-900", "text-white", "border-zinc-900");
      btn.classList.remove("bg-white", "text-zinc-700", "border-zinc-300");
    } else {
      btn.classList.remove("active", "bg-zinc-900", "text-white", "border-zinc-900");
      btn.classList.add("bg-white", "text-zinc-700", "border-zinc-300");
    }
  });
}

// Awesome-Design-MD Themes State & Catalog (100 Top Brands & Curated Systems)
let activeThemeFilter = "all";
let activeThemeSearch = "";
let modalCurrentThemeId = "configurator";
let modalActiveTab = "studio"; // "studio" or "markdown"

const DEFAULT_AWESOME_THEMES = (typeof window !== "undefined" && window.AWESOME_100_THEMES) || [];

// Helper: Determine if a HEX color is light or dark for optimal text contrast
function isColorLight(hex) {
  if (!hex || typeof hex !== "string") return false;
  let c = hex.replace("#", "").trim();
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  if (c.length !== 6) return false;
  const r = parseInt(c.substr(0, 2), 16) || 0;
  const g = parseInt(c.substr(2, 2), 16) || 0;
  const b = parseInt(c.substr(4, 2), 16) || 0;
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

function updateActiveThemeBadge() {
  if (!el.galleryActiveThemeBadge) return;
  const currentId = state.designSuite.designMdPreset;
  const themes = (state.catalog && state.catalog.designSuite && state.catalog.designSuite.themes) || DEFAULT_AWESOME_THEMES;
  const currentTheme = themes.find(t => t.id === currentId);
  if (currentTheme) {
    el.galleryActiveThemeBadge.innerHTML = `
      <span class="w-2 h-2 rounded-full inline-block shrink-0" style="background-color: ${currentTheme.accent}"></span>
      <span class="truncate">${escapeHtml(currentTheme.name)} (${escapeHtml(currentTheme.tag)})</span>
    `;
  } else if (currentId === "none") {
    el.galleryActiveThemeBadge.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-zinc-400 inline-block shrink-0"></span>
      <span>Fără fișier DESIGN.md</span>
    `;
  } else {
    el.galleryActiveThemeBadge.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0"></span>
      <span>${escapeHtml(currentId)}</span>
    `;
  }
}

function selectThemePreset(themeId) {
  state.designSuite.designMdPreset = themeId;
  if (el.designMdSelect) {
    el.designMdSelect.value = themeId;
  }
  updateActiveThemeBadge();
  renderThemesGallery();
  triggerPreview();
  const themes = (state.catalog && state.catalog.designSuite && state.catalog.designSuite.themes) || DEFAULT_AWESOME_THEMES;
  const t = themes.find(x => x.id === themeId);
  showToast(`Tema ${t ? t.name : themeId} a fost activată în DESIGN.md!`, "success");
}

function switchModalTab(tab) {
  modalActiveTab = tab;
  if (el.modalTabBtnStudio && el.modalTabBtnMarkdown && el.modalPaneStudio && el.modalPaneMarkdown) {
    if (tab === "studio") {
      el.modalTabBtnStudio.classList.add("active", "bg-white", "text-zinc-950", "shadow-xs");
      el.modalTabBtnStudio.classList.remove("text-zinc-600");
      el.modalTabBtnMarkdown.classList.remove("active", "bg-white", "text-zinc-950", "shadow-xs");
      el.modalTabBtnMarkdown.classList.add("text-zinc-600");
      el.modalPaneStudio.classList.remove("hidden");
      el.modalPaneMarkdown.classList.add("hidden");
    } else {
      el.modalTabBtnMarkdown.classList.add("active", "bg-white", "text-zinc-950", "shadow-xs");
      el.modalTabBtnMarkdown.classList.remove("text-zinc-600");
      el.modalTabBtnStudio.classList.remove("active", "bg-white", "text-zinc-950", "shadow-xs");
      el.modalTabBtnStudio.classList.add("text-zinc-600");
      el.modalPaneMarkdown.classList.remove("hidden");
      el.modalPaneStudio.classList.add("hidden");
    }
  }
  if (window.lucide) lucide.createIcons();
}

function openThemeSpecModal(themeId) {
  modalCurrentThemeId = themeId;
  const themes = (state.catalog && state.catalog.designSuite && state.catalog.designSuite.themes) || DEFAULT_AWESOME_THEMES;
  const theme = themes.find(t => t.id === themeId) || { 
    id: themeId, 
    name: themeId, 
    brand: themeId, 
    tag: "Design System",
    stars: "Craft Standard ⭐",
    accent: "#18181b",
    canvas: "#ffffff",
    surface: "#f8f9fa",
    border: "#e5e7eb",
    text: "#09090b",
    textMuted: "#64748b",
    font: "Inter",
    fontFamily: "'Inter', sans-serif",
    radius: "6px",
    borderRadius: "6px",
    description: "Design system modern.",
    principles: ["Minimalism", "Accesibilitate", "Performanță"]
  };

  // 1. Update Modal Header
  if (el.modalThemeTitle) {
    el.modalThemeTitle.textContent = `${theme.name} (${theme.brand})`;
  }
  if (el.modalThemeDesc) {
    el.modalThemeDesc.textContent = theme.description;
  }
  if (el.modalThemeTagBadge) {
    el.modalThemeTagBadge.textContent = theme.tag;
  }
  if (el.modalThemeStarsBadge) {
    el.modalThemeStarsBadge.textContent = theme.stars || "Craft Standard ⭐";
  }
  if (el.modalThemeIconBox) {
    el.modalThemeIconBox.style.backgroundColor = theme.accent;
  }

  // 2. Render Markdown Tab
  let mdContent = "";
  if (state.catalog && state.catalog.designSuite && state.catalog.designSuite.presetDocs && state.catalog.designSuite.presetDocs[themeId]) {
    mdContent = state.catalog.designSuite.presetDocs[themeId];
    mdContent = [
      "---",
      "version: 1.0",
      `name: ${theme.id}-design-system`,
      `brand: ${theme.brand}`,
      `tag: ${theme.tag}`,
      `category: ${theme.category}`,
      "---",
      "",
      `# Design System: ${theme.name} (${theme.brand})`,
      "",
      `> **Tagline**: ${theme.tag}`,
      `> **Category**: ${theme.category}`,
      `> **Standard**: ${theme.stars || "Craft Standard ⭐"}`,
      "",
      "## 1. Palette & Surface Tokens",
      `- **Canvas (Background)**: \`${theme.canvas}\``,
      `- **Surface (Card / Panel)**: \`${theme.surface}\``,
      `- **Hairline Border**: \`${theme.border}\``,
      `- **Primary Accent**: \`${theme.accent}\``,
      `- **Text Primary**: \`${theme.text}\``,
      `- **Text Muted**: \`${theme.textMuted || "#8a8f98"}\``,
      "",
      "## 2. Typography Hierarchy",
      `- **Font Scale**: ${theme.font}`,
      `- **Primary CSS Family**: ${theme.fontFamily || "'Inter', sans-serif"}`,
      "- Display: 28px - 36px font-bold tracking-tight",
      "- Heading 1: 20px - 24px font-semibold",
      "- Body Text: 14px font-normal leading-relaxed",
      "- Monospace / Code: 12px font-mono",
      "",
      "## 3. Geometry & Radii",
      `- **Border Radius**: ${theme.radius}`,
      `- **Base CSS Radius**: ${theme.borderRadius || "6px"}`,
      `- **Border Width**: Strictly 1px crisp hairline stroke (\`${theme.border}\`)`,
      "",
      "## 4. Core Craft Principles",
      ...(theme.principles || []).map(p => `- ${p}`),
      "",
      "## 5. CSS Custom Properties (:root)",
      "```css",
      ":root {",
      `  --canvas: ${theme.canvas};`,
      `  --surface: ${theme.surface};`,
      `  --border: ${theme.border};`,
      `  --accent: ${theme.accent};`,
      `  --text-primary: ${theme.text};`,
      `  --text-muted: ${theme.textMuted || "#8a8f98"};`,
      `  --font-family: ${theme.fontFamily || "'Inter', sans-serif"};`,
      `  --radius: ${theme.borderRadius || "6px"};`,
      "}",
      "```"
    ].join("\n");
  }

  if (el.modalThemeCode) {
    el.modalThemeCode.textContent = mdContent;
  }

  // 3. Render Large Studio UI Tab
  if (el.modalPaneStudio) {
    el.modalPaneStudio.innerHTML = renderThemeStudio(theme);
    bindStudioInteractiveEvents(theme);
  }

  // 4. Update Activate Button
  if (el.modalThemeActivate) {
    if (state.designSuite.designMdPreset === themeId) {
      el.modalThemeActivate.innerHTML = `<i data-lucide="check-check" class="w-4 h-4"></i><span>Temă Deja Activă</span>`;
      el.modalThemeActivate.classList.add("opacity-80");
    } else {
      el.modalThemeActivate.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i><span>Activează ca DESIGN.md în Proiect</span>`;
      el.modalThemeActivate.classList.remove("opacity-80");
    }
  }

  // Switch to studio tab by default
  switchModalTab("studio");

  if (el.modalThemePreview) {
    el.modalThemePreview.classList.remove("hidden");
  }

  if (window.lucide) lucide.createIcons();
}

function closeThemeSpecModal() {
  if (el.modalThemePreview) {
    el.modalThemePreview.classList.add("hidden");
  }
}

// Binds live copy and toggle interactions inside the large Studio preview modal
function bindStudioInteractiveEvents(theme) {
  // Swatch copy buttons
  document.querySelectorAll(".btn-copy-hex").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const hex = btn.getAttribute("data-hex");
      if (hex) {
        navigator.clipboard.writeText(hex);
        showToast(`Cod HEX ${hex} copiat în clipboard!`, "success");
      }
    });
  });

  // Interactive toggle switch demo
  const switchDemo = document.getElementById("studio-switch-demo");
  if (switchDemo) {
    switchDemo.addEventListener("click", () => {
      const knob = switchDemo.querySelector(".switch-knob");
      const isChecked = switchDemo.getAttribute("data-checked") === "true";
      if (isChecked) {
        switchDemo.setAttribute("data-checked", "false");
        switchDemo.style.backgroundColor = theme.border;
        if (knob) knob.style.transform = "translateX(0px)";
      } else {
        switchDemo.setAttribute("data-checked", "true");
        switchDemo.style.backgroundColor = theme.accent;
        if (knob) knob.style.transform = "translateX(16px)";
      }
    });
  }
}

// Render Consistent, Rich Card Mini-Mockup for EVERY Brand Theme
function renderThemeMockup(theme) {
  const { id, canvas, surface, border, text, textMuted, accent, radius, borderRadius, font, fontFamily } = theme;

  const fontCss = `font-family: ${fontFamily || "'Plus Jakarta Sans', sans-serif"};`;
  const muted = textMuted || "#71717a";
  const bRadius = borderRadius || "4px";

  const isAccentLight = isColorLight(accent);
  const accentTextColor = isAccentLight ? "#09090b" : "#ffffff";

  return `
    <div 
      class="theme-mockup-frame rounded-sm p-3 select-none transition-all duration-200 hover:shadow-md cursor-pointer group/mockup space-y-2.5"
      style="background-color: ${canvas}; color: ${text}; border: 1px solid ${border}; ${fontCss}"
      title="Click pentru Studio de Previzualizare Complet (${escapeHtml(theme.name)})"
      data-theme-id="${theme.id}"
    >
      <!-- 1. Top Bar: Beacon, Command Pill, Status -->
      <div class="flex items-center justify-between text-[10px] pb-1.5 border-b" style="border-color: ${border}">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="w-2 h-2 rounded-full shrink-0 animate-pulse" style="background-color: ${accent}"></span>
          <span class="font-bold tracking-tight truncate text-[10px]" style="color: ${text}">${escapeHtml(theme.name)}</span>
          <span class="text-[8px] font-mono opacity-60">● Live</span>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <span class="px-1.5 py-0.2 text-[8px] font-mono rounded" style="background-color: ${surface}; border: 1px solid ${border}; color: ${text}">⌘K</span>
          <span class="px-1.5 py-0.2 text-[8px] font-mono font-bold rounded" style="background: ${accent}25; color: ${accent}; border: 1px solid ${accent}40">PRO</span>
        </div>
      </div>

      <!-- 2. Typography Headline & Metric Container -->
      <div class="p-2.5 rounded shadow-2xs space-y-1.5" style="background-color: ${surface}; border: 1px solid ${border}; border-radius: ${bRadius};">
        <div class="flex items-center justify-between">
          <span class="text-[9px] uppercase tracking-wider font-semibold opacity-70" style="color: ${muted}">Active Metric</span>
          <span class="text-[9px] font-bold font-mono px-1 py-0.2 rounded" style="background: ${accent}15; color: ${accent}">+24.8% ↗</span>
        </div>
        <div class="flex items-baseline justify-between">
          <span class="text-xs font-bold tracking-tight" style="color: ${text}">99.98% SLA</span>
          <span class="text-[8px] font-mono opacity-60">14.2ms latency</span>
        </div>
        <!-- Progress track -->
        <div class="w-full h-1.5 rounded-full overflow-hidden" style="background-color: ${border}">
          <div class="h-full rounded-full" style="width: 76%; background-color: ${accent}"></div>
        </div>
      </div>

      <!-- 3. Form & Interactive Controls Row -->
      <div class="flex items-center justify-between gap-2 text-[9px] font-mono">
        <!-- Mini Segmented Control -->
        <div class="flex items-center p-0.5 rounded border" style="background: ${canvas}; border-color: ${border}; border-radius: ${bRadius}">
          <span class="px-1.5 py-0.5 font-bold shadow-2xs" style="background: ${accent}; color: ${accentTextColor}; border-radius: ${bRadius}">Tab A</span>
          <span class="px-1.5 py-0.5 opacity-60" style="color: ${text}">Tab B</span>
        </div>

        <!-- Mini Toggle Switch Indicator -->
        <div class="flex items-center gap-1.5">
          <span class="text-[8px] opacity-70">Sync</span>
          <div class="w-6 h-3 rounded-full relative p-0.5 flex items-center shadow-inner" style="background-color: ${accent}">
            <div class="w-2 h-2 rounded-full bg-white ml-auto shadow-xs"></div>
          </div>
        </div>
      </div>

      <!-- 4. Action Buttons -->
      <div class="flex items-center justify-between gap-1.5 pt-0.5">
        <div class="flex-1 py-1 text-center text-[9px] font-bold shadow-xs transition hover:opacity-90" style="background-color: ${accent}; color: ${accentTextColor}; border-radius: ${bRadius}">
          Deploy
        </div>
        <div class="px-2 py-1 text-[9px] font-medium border text-center opacity-80 shadow-2xs" style="border-color: ${border}; color: ${text}; border-radius: ${bRadius}">
          Inspect
        </div>
      </div>

      <!-- 5. 5-Color Swatch Strip -->
      <div class="flex items-center justify-between pt-1 border-t" style="border-color: ${border}">
        <span class="text-[8px] font-mono opacity-50">Radius: ${escapeHtml(radius.split(' ')[0])}</span>
        <div class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-xs border shadow-2xs" style="background-color: ${canvas}; border-color: ${border}" title="Canvas: ${canvas}"></span>
          <span class="w-2.5 h-2.5 rounded-xs border shadow-2xs" style="background-color: ${surface}; border-color: ${border}" title="Surface: ${surface}"></span>
          <span class="w-2.5 h-2.5 rounded-xs border shadow-2xs" style="background-color: ${border}; border-color: #999" title="Border: ${border}"></span>
          <span class="w-2.5 h-2.5 rounded-xs border shadow-2xs" style="background-color: ${text}; border-color: ${border}" title="Text: ${text}"></span>
          <span class="w-2.5 h-2.5 rounded-xs border shadow-2xs" style="background-color: ${accent}; border-color: ${border}" title="Accent: ${accent}"></span>
        </div>
      </div>
    </div>
  `;
}

// Render the Full-Featured Studio Showcase UI inside the Large Modal
function renderThemeStudio(theme) {
  const { id, canvas, surface, border, text, textMuted, accent, radius, borderRadius, font, fontFamily, principles, description } = theme;
  const muted = textMuted || "#71717a";
  const bRadius = borderRadius || "6px";
  const fontCss = `font-family: ${fontFamily || "'Plus Jakarta Sans', sans-serif"};`;
  const isAccentLight = isColorLight(accent);
  const accentTextColor = isAccentLight ? "#09090b" : "#ffffff";

  // Swatches list
  const swatches = [
    { name: "Canvas (Bg)", hex: canvas },
    { name: "Surface (Card)", hex: surface },
    { name: "Hairline Border", hex: border },
    { name: "Primary Accent", hex: accent },
    { name: "Text Primary", hex: text },
    { name: "Text Muted", hex: muted },
    { name: "Success / Live", hex: "#10b981" },
    { name: "Warning / Alert", hex: "#f59e0b" }
  ];

  return `
    <div class="space-y-6" style="${fontCss}">
      
      <!-- 1. LIVE APP SIMULATION WINDOW -->
      <div class="rounded-sm border shadow-md overflow-hidden" style="background-color: ${canvas}; border-color: ${border}; color: ${text};">
        
        <!-- Window Titlebar -->
        <div class="px-4 py-3 border-b flex items-center justify-between gap-3" style="border-color: ${border}; background-color: ${surface};">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span class="text-xs font-mono font-semibold ml-2 opacity-70">${escapeHtml(theme.brand)} App Studio</span>
          </div>

          <!-- Omnibar -->
          <div class="flex-1 max-w-md hidden sm:flex items-center gap-2 px-3 py-1 rounded border text-xs font-mono" style="background-color: ${canvas}; border-color: ${border}; color: ${muted}; border-radius: ${bRadius}">
            <i data-lucide="search" class="w-3.5 h-3.5 opacity-60"></i>
            <span class="truncate">/home/oem/proiecte/preConfigProject</span>
            <span class="ml-auto text-[9px] px-1.5 py-0.2 rounded font-bold" style="background-color: ${surface}; border: 1px solid ${border};">⌘K</span>
          </div>

          <!-- Status badge -->
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full animate-pulse" style="background-color: ${accent}"></span>
            <span class="text-xs font-bold font-mono" style="color: ${accent}">Online</span>
          </div>
        </div>

        <!-- Window Body Content -->
        <div class="p-6 space-y-6">
          
          <!-- Hero Section inside App Window -->
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b" style="border-color: ${border}">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider" style="background: ${accent}20; color: ${accent}; border: 1px solid ${accent}40;">
                  ${escapeHtml(theme.tag)}
                </span>
                <span class="text-xs font-mono opacity-60">${escapeHtml(theme.stars)}</span>
              </div>
              <h2 class="text-2xl font-bold tracking-tight" style="color: ${text}">${escapeHtml(theme.name)} Design System</h2>
              <p class="text-xs leading-relaxed max-w-2xl mt-1" style="color: ${muted}">${escapeHtml(description)}</p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button type="button" class="px-4 py-2 text-xs font-bold shadow-sm transition hover:opacity-90 cursor-pointer" style="background-color: ${accent}; color: ${accentTextColor}; border-radius: ${bRadius}">
                Lansează Modul
              </button>
              <button type="button" class="px-3.5 py-2 text-xs font-semibold border shadow-2xs cursor-pointer" style="border-color: ${border}; color: ${text}; background-color: ${surface}; border-radius: ${bRadius}">
                Documentație
              </button>
            </div>
          </div>

          <!-- KPI Metrics Row -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="p-4 rounded border shadow-2xs space-y-1.5" style="background-color: ${surface}; border-color: ${border}; border-radius: ${bRadius}">
              <div class="flex items-center justify-between text-xs font-mono" style="color: ${muted}">
                <span>Throughput Mediu</span>
                <span class="text-[10px] font-bold px-1.5 py-0.2 rounded" style="background: ${accent}20; color: ${accent}">+34.2% ↗</span>
              </div>
              <div class="text-2xl font-bold tracking-tight" style="color: ${text}">148.2 k/s</div>
              <div class="w-full h-1.5 rounded-full overflow-hidden" style="background-color: ${border}">
                <div class="h-full rounded-full" style="width: 82%; background-color: ${accent}"></div>
              </div>
            </div>

            <div class="p-4 rounded border shadow-2xs space-y-1.5" style="background-color: ${surface}; border-color: ${border}; border-radius: ${bRadius}">
              <div class="flex items-center justify-between text-xs font-mono" style="color: ${muted}">
                <span>Latență Execuție</span>
                <span class="text-[10px] font-bold text-emerald-500">Optim (0 dropped)</span>
              </div>
              <div class="text-2xl font-bold tracking-tight" style="color: ${text}">4.18 ms</div>
              <div class="w-full h-1.5 rounded-full overflow-hidden" style="background-color: ${border}">
                <div class="h-full rounded-full bg-emerald-500" style="width: 95%;"></div>
              </div>
            </div>

            <div class="p-4 rounded border shadow-2xs space-y-1.5" style="background-color: ${surface}; border-color: ${border}; border-radius: ${bRadius}">
              <div class="flex items-center justify-between text-xs font-mono" style="color: ${muted}">
                <span>Securitate & OWASP</span>
                <span class="text-[10px] font-bold px-1.5 py-0.2 rounded font-mono" style="background-color: ${canvas}; border: 1px solid ${border}; color: ${text}">Grade AAA</span>
              </div>
              <div class="text-2xl font-bold tracking-tight" style="color: ${text}">100% Pass</div>
              <div class="w-full h-1.5 rounded-full overflow-hidden" style="background-color: ${border}">
                <div class="h-full rounded-full" style="width: 100%; background-color: ${accent}"></div>
              </div>
            </div>
          </div>

          <!-- Component Playground Matrix -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            
            <!-- Left: Form Controls & Inputs -->
            <div class="p-5 rounded border space-y-4" style="background-color: ${surface}; border-color: ${border}; border-radius: ${bRadius}">
              <h4 class="text-xs font-bold uppercase tracking-wider font-mono opacity-80" style="color: ${text}">Form & Input Controls</h4>
              
              <div class="space-y-1.5">
                <label class="text-xs font-medium block" style="color: ${text}">Target Omnibar Input</label>
                <div class="flex items-center gap-2 px-3 py-2 rounded border" style="background-color: ${canvas}; border-color: ${border}; border-radius: ${bRadius}">
                  <i data-lucide="terminal" class="w-4 h-4 opacity-50"></i>
                  <input type="text" value="git commit -m 'feat: architectural luxury'" readonly class="bg-transparent text-xs w-full outline-none font-mono" style="color: ${text}">
                </div>
              </div>

              <!-- Interactive Controls Row -->
              <div class="flex flex-wrap items-center justify-between gap-4 pt-1">
                <!-- Interactive Toggle -->
                <div class="flex items-center gap-2 cursor-pointer select-none" id="studio-switch-demo" data-checked="true" style="background-color: transparent">
                  <div class="w-10 h-5 rounded-full p-0.5 transition-colors shadow-inner flex items-center" style="background-color: ${accent};">
                    <div class="switch-knob w-4 h-4 rounded-full bg-white shadow-xs transition-transform transform translate-x-4"></div>
                  </div>
                  <span class="text-xs font-medium" style="color: ${text}">Auto-Sync Telemetry</span>
                </div>

                <!-- Checkbox -->
                <label class="flex items-center gap-2 text-xs font-medium cursor-pointer" style="color: ${text}">
                  <span class="w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-xs" style="background-color: ${accent}; border-radius: 2px;">✓</span>
                  <span>Strict Type Checking</span>
                </label>
              </div>

              <!-- Slider control -->
              <div class="space-y-1 pt-1">
                <div class="flex items-center justify-between text-xs font-mono" style="color: ${muted}">
                  <span>Intensity Scale</span>
                  <span class="font-bold" style="color: ${text}">85%</span>
                </div>
                <div class="w-full h-2 rounded-full relative flex items-center" style="background-color: ${canvas}; border: 1px solid ${border}">
                  <div class="h-full rounded-full" style="width: 85%; background-color: ${accent}"></div>
                  <div class="w-3.5 h-3.5 rounded-full bg-white border shadow-xs absolute -translate-x-1/2" style="left: 85%; border-color: ${border}"></div>
                </div>
              </div>
            </div>

            <!-- Right: Interactive Buttons & Badges -->
            <div class="p-5 rounded border space-y-4" style="background-color: ${surface}; border-color: ${border}; border-radius: ${bRadius}">
              <h4 class="text-xs font-bold uppercase tracking-wider font-mono opacity-80" style="color: ${text}">Button Hierarchy & Pills</h4>
              
              <div class="flex flex-wrap items-center gap-2">
                <button type="button" class="px-4 py-2 text-xs font-bold shadow-xs transition hover:opacity-90" style="background-color: ${accent}; color: ${accentTextColor}; border-radius: ${bRadius}">
                  Primary Button
                </button>
                <button type="button" class="px-4 py-2 text-xs font-semibold border shadow-2xs" style="border-color: ${border}; color: ${text}; background-color: ${canvas}; border-radius: ${bRadius}">
                  Secondary Outline
                </button>
                <button type="button" class="px-3 py-2 text-xs font-medium opacity-80 hover:opacity-100" style="color: ${text}">
                  Ghost Action
                </button>
                <button type="button" class="px-4 py-1.5 text-xs font-bold rounded-full shadow-xs" style="background-color: ${accent}; color: ${accentTextColor}">
                  Pill Badge
                </button>
              </div>

              <!-- Alert Banner inside theme -->
              <div class="p-3 rounded border flex items-center gap-3 text-xs" style="background-color: ${canvas}; border-color: ${border}; border-radius: ${bRadius}">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span class="font-mono text-[11px]" style="color: ${text}">Ready: Sistemul respectă rigoarea ${escapeHtml(theme.name)}.</span>
              </div>

              <!-- Segmented Control Bar -->
              <div class="flex items-center p-1 rounded border text-xs font-mono" style="background-color: ${canvas}; border-color: ${border}; border-radius: ${bRadius}">
                <button type="button" class="flex-1 py-1 text-center font-bold shadow-xs" style="background-color: ${accent}; color: ${accentTextColor}; border-radius: ${bRadius}">
                  Overview
                </button>
                <button type="button" class="flex-1 py-1 text-center opacity-70" style="color: ${text}">
                  Tokens
                </button>
                <button type="button" class="flex-1 py-1 text-center opacity-70" style="color: ${text}">
                  Components
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- 2. COLOR PALETTE MATRIX & TOKEN SWATCHES -->
      <div class="bg-white p-5 rounded-sm border border-zinc-200 shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="palette" class="w-4 h-4 text-zinc-800"></i>
            <h3 class="text-xs font-bold text-zinc-950 uppercase tracking-wider font-mono">Paletă de Culori & Tokeni Live</h3>
          </div>
          <span class="text-[11px] font-mono text-zinc-500">Click pe swatch pentru a copia HEX-ul</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
          ${swatches.map(s => `
            <div 
              class="btn-copy-hex group relative flex flex-col p-2 rounded-sm border border-zinc-200 hover:border-zinc-400 bg-zinc-50 transition cursor-pointer"
              data-hex="${s.hex}"
              title="Click pentru a copia ${s.hex}"
            >
              <div class="w-full h-10 rounded-xs border shadow-2xs mb-1.5 transition group-hover:scale-105" style="background-color: ${s.hex}; border-color: rgba(0,0,0,0.1)"></div>
              <span class="text-[10px] font-bold text-zinc-900 truncate leading-tight">${escapeHtml(s.name)}</span>
              <span class="text-[10px] font-mono text-zinc-500 uppercase mt-0.5">${escapeHtml(s.hex)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 3. TYPOGRAPHY & GEOMETRY LADDER -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Typography Scale -->
        <div class="bg-white p-5 rounded-sm border border-zinc-200 shadow-xs space-y-3">
          <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
            <div class="flex items-center gap-2">
              <i data-lucide="type" class="w-4 h-4 text-zinc-800"></i>
              <h3 class="text-xs font-bold text-zinc-950 uppercase tracking-wider font-mono">Scara Tipografică</h3>
            </div>
            <span class="text-[11px] font-mono text-zinc-500">${escapeHtml(font)}</span>
          </div>

          <div class="space-y-3 pt-1" style="${fontCss}">
            <div>
              <span class="text-[9px] font-mono text-zinc-400 uppercase block">Display / Hero (26px)</span>
              <div class="text-xl font-bold tracking-tight text-zinc-950">Agile Engineering Craft</div>
            </div>
            <div>
              <span class="text-[9px] font-mono text-zinc-400 uppercase block">Heading 1 (18px)</span>
              <div class="text-base font-semibold text-zinc-900">Configurarea Sistemului Arhitectural</div>
            </div>
            <div>
              <span class="text-[9px] font-mono text-zinc-400 uppercase block">Body Regular (13px)</span>
              <p class="text-xs text-zinc-600 leading-relaxed">
                Fiecare componentă este calibrată conform standardelor de design ${escapeHtml(theme.name)}. Contrastul respectă cerințele WCAG, iar tranzițiile urmează curbele fizice naturale.
              </p>
            </div>
          </div>
        </div>

        <!-- Geometry, Radii & Principles -->
        <div class="bg-white p-5 rounded-sm border border-zinc-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between border-b border-zinc-100 pb-2 mb-3">
              <div class="flex items-center gap-2">
                <i data-lucide="maximize" class="w-4 h-4 text-zinc-800"></i>
                <h3 class="text-xs font-bold text-zinc-950 uppercase tracking-wider font-mono">Raze de Colț & Principii</h3>
              </div>
              <span class="text-[11px] font-mono font-semibold text-zinc-800">${escapeHtml(radius)}</span>
            </div>

            <!-- Radii Ladder comparison -->
            <div class="space-y-1.5">
              <span class="text-[10px] font-mono text-zinc-400 uppercase block">Comparație Raze de Colț:</span>
              <div class="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                <div class="p-2 border ${borderRadius === '0px' ? 'border-zinc-950 bg-zinc-900 text-white font-bold ring-2 ring-zinc-950' : 'border-zinc-300 bg-zinc-50 text-zinc-700'}" style="border-radius: 0px">0px Sharp</div>
                <div class="p-2 border ${borderRadius === '2px' ? 'border-zinc-950 bg-zinc-900 text-white font-bold ring-2 ring-zinc-950' : 'border-zinc-300 bg-zinc-50 text-zinc-700'}" style="border-radius: 2px">2px Crisp</div>
                <div class="p-2 border ${borderRadius === '6px' || borderRadius === '8px' ? 'border-zinc-950 bg-zinc-900 text-white font-bold ring-2 ring-zinc-950' : 'border-zinc-300 bg-zinc-50 text-zinc-700'}" style="border-radius: 8px">8px Card</div>
                <div class="p-2 border ${borderRadius === '12px' || borderRadius === '14px' || borderRadius === '16px' ? 'border-zinc-950 bg-zinc-900 text-white font-bold ring-2 ring-zinc-950' : 'border-zinc-300 bg-zinc-50 text-zinc-700'}" style="border-radius: 16px">16px Squircle</div>
              </div>
            </div>

            <!-- Principles list -->
            <div class="space-y-1.5 pt-3">
              <span class="text-[10px] font-mono text-zinc-400 uppercase block">Principii de Bază (${escapeHtml(theme.brand)}):</span>
              <div class="space-y-1">
                ${principles.map(p => `
                  <div class="flex items-center gap-2 text-xs text-zinc-700 font-mono">
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-900 shrink-0"></span>
                    <span>${escapeHtml(p)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Categoria: <strong class="text-zinc-900">${escapeHtml(theme.category)}</strong></span>
            <span>Standard: <strong class="text-zinc-900">${escapeHtml(theme.stars || '115k+ ⭐')}</strong></span>
          </div>
        </div>

      </div>

    </div>
  `;
}

function populateDesignSelectOptions() {
  if (!el.designMdSelect) return;
  const themes = (state.catalog && state.catalog.designSuite && state.catalog.designSuite.themes) || DEFAULT_AWESOME_THEMES;
  if (!themes || themes.length === 0) return;

  const currentVal = state.designSuite.designMdPreset || el.designMdSelect.value;
  
  const groups = {
    "Platforma Curentă & Craft": [],
    "Developer & Cloud": [],
    "Fintech & Enterprise": [],
    "AI & Creative Design": [],
    "Luxury & High Fashion": [],
    "Editorial & Media": [],
    "Consumer & Lifestyle": []
  };

  themes.forEach(t => {
    const cat = (t.category || "").toLowerCase();
    if (t.id === "configurator" || t.id === "linear") {
      groups["Platforma Curentă & Craft"].push(t);
    } else if (cat.includes("dev")) {
      groups["Developer & Cloud"].push(t);
    } else if (cat.includes("fintech")) {
      groups["Fintech & Enterprise"].push(t);
    } else if (cat.includes("ai") || cat.includes("creative")) {
      groups["AI & Creative Design"].push(t);
    } else if (cat.includes("luxury")) {
      groups["Luxury & High Fashion"].push(t);
    } else if (cat.includes("editorial")) {
      groups["Editorial & Media"].push(t);
    } else {
      groups["Consumer & Lifestyle"].push(t);
    }
  });

  let html = "";
  for (const [groupName, groupThemes] of Object.entries(groups)) {
    if (groupThemes.length > 0) {
      html += `<optgroup label="${groupName}">`;
      for (const t of groupThemes) {
        const isSel = (t.id === currentVal) ? "selected" : "";
        html += `<option value="${t.id}" ${isSel}>${escapeHtml(t.name)} (${escapeHtml(t.tag)})</option>`;
      }
      html += `</optgroup>`;
    }
  }

  el.designMdSelect.innerHTML = html;
  el.designMdSelect.value = currentVal;
}

function renderThemesGallery(filter = activeThemeFilter, query = activeThemeSearch) {
  if (!el.themesGridContainer) return;

  activeThemeFilter = filter;
  activeThemeSearch = query;
  updateActiveThemeBadge();

  const themesSource = (state.catalog && state.catalog.designSuite && state.catalog.designSuite.themes) || DEFAULT_AWESOME_THEMES;
  
  // Apply category filter
  let filtered = themesSource.filter(theme => {
    if (filter === "all") return true;
    const cat = (theme.category || "").toLowerCase();
    if (filter === "dark") return cat.includes("dark");
    if (filter === "light") return cat.includes("light");
    if (filter === "dev") return cat.includes("dev");
    if (filter === "fintech") return cat.includes("fintech");
    if (filter === "ai") return cat.includes("ai") || cat.includes("creative");
    if (filter === "luxury") return cat.includes("luxury");
    if (filter === "editorial") return cat.includes("editorial");
    if (filter === "lifestyle") return cat.includes("lifestyle");
    return true;
  });

  // Apply search query filter
  if (query && query.trim() !== "") {
    const q = query.trim().toLowerCase();
    filtered = filtered.filter(t => {
      const searchTarget = `${t.name} ${t.brand} ${t.tag} ${t.description} ${(t.principles || []).join(" ")} ${t.font}`.toLowerCase();
      return searchTarget.includes(q);
    });
  }

  el.themesGridContainer.innerHTML = "";

  if (filtered.length === 0) {
    el.themesGridContainer.innerHTML = `
      <div class="col-span-full py-12 text-center text-zinc-500 bg-white border border-dashed border-zinc-300 rounded-sm space-y-2">
        <i data-lucide="search-x" class="w-8 h-8 mx-auto text-zinc-400"></i>
        <p class="text-xs font-medium">Nicio temă găsită pentru termenul "${escapeHtml(query)}".</p>
        <button type="button" id="btn-reset-themes-filter" class="text-xs font-semibold text-zinc-900 underline cursor-pointer hover:text-black">Resetează filtrele</button>
      </div>
    `;
    const resetBtn = document.getElementById("btn-reset-themes-filter");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (el.themesSearchInput) el.themesSearchInput.value = "";
        activeThemeSearch = "";
        const allBtn = document.querySelector('.theme-filter-btn[data-filter="all"]');
        if (allBtn) allBtn.click();
        else renderThemesGallery("all", "");
      });
    }
    if (window.lucide) lucide.createIcons();
    return;
  }

  filtered.forEach(theme => {
    const isActive = (state.designSuite.designMdPreset === theme.id);
    const card = document.createElement("div");
    card.className = `glass-card rounded-sm p-5 border ${
      isActive ? "border-zinc-900 ring-1 ring-zinc-900 shadow-md" : "border-zinc-200 hover:border-zinc-400"
    } flex flex-col justify-between transition group relative bg-white`;

    card.innerHTML = `
      <div class="space-y-3">
        <!-- Brand Header & Active Status -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-sm flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs" style="background-color: ${theme.canvas}; color: ${theme.text}; border: 1px solid ${theme.border}">
              <i data-lucide="${theme.icon || 'palette'}" class="w-4 h-4" style="color: ${theme.accent}"></i>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <h3 class="text-xs font-bold text-zinc-950">${escapeHtml(theme.name)}</h3>
                <span class="text-[10px] text-zinc-400 font-mono">(${escapeHtml(theme.brand)})</span>
              </div>
              <span class="inline-block text-[10px] font-mono font-semibold text-zinc-600 truncate">${escapeHtml(theme.tag)}</span>
            </div>
          </div>
          
          <div class="flex flex-col items-end gap-1 shrink-0">
            <span class="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-zinc-100 text-zinc-600 border border-zinc-200">${escapeHtml(theme.stars || '115k+ ⭐')}</span>
            ${isActive ? `
              <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase tracking-wider">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Activ
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Live Design System Mockup Preview (Real Font, Colors & Page Elements) -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span class="flex items-center gap-1 font-semibold text-zinc-700">
              <i data-lucide="layout" class="w-3 h-3 text-zinc-400"></i>
              <span>Previzualizare Pagină (${escapeHtml(theme.name)})</span>
            </span>
            <span class="text-[9px] text-zinc-400 font-mono truncate max-w-[140px]">${escapeHtml(theme.font.split('/')[0])}</span>
          </div>
          ${renderThemeMockup(theme)}
        </div>

        <!-- Color Palette Strip -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span>Paletă culori</span>
            <span class="font-bold" style="color: ${theme.accent}">${escapeHtml(theme.accent)}</span>
          </div>
          <div class="grid grid-cols-5 gap-1.5 p-1.5 bg-zinc-50 rounded-sm border border-zinc-200">
            <div class="group/swatch relative flex flex-col items-center">
              <div class="w-full h-5 rounded-xs border shadow-2xs" style="background-color: ${theme.accent}; border-color: ${theme.border};" title="Accent: ${theme.accent}"></div>
              <span class="text-[8px] font-mono text-zinc-500 mt-0.5">accent</span>
            </div>
            <div class="group/swatch relative flex flex-col items-center">
              <div class="w-full h-5 rounded-xs border shadow-2xs" style="background-color: ${theme.canvas}; border-color: ${theme.border};" title="Canvas: ${theme.canvas}"></div>
              <span class="text-[8px] font-mono text-zinc-500 mt-0.5">canvas</span>
            </div>
            <div class="group/swatch relative flex flex-col items-center">
              <div class="w-full h-5 rounded-xs border shadow-2xs" style="background-color: ${theme.surface}; border-color: ${theme.border};" title="Surface: ${theme.surface}"></div>
              <span class="text-[8px] font-mono text-zinc-500 mt-0.5">surface</span>
            </div>
            <div class="group/swatch relative flex flex-col items-center">
              <div class="w-full h-5 rounded-xs border shadow-2xs" style="background-color: ${theme.border}; border-color: #999;" title="Border: ${theme.border}"></div>
              <span class="text-[8px] font-mono text-zinc-500 mt-0.5">border</span>
            </div>
            <div class="group/swatch relative flex flex-col items-center">
              <div class="w-full h-5 rounded-xs border shadow-2xs" style="background-color: ${theme.text}; border-color: ${theme.border};" title="Text: ${theme.text}"></div>
              <span class="text-[8px] font-mono text-zinc-500 mt-0.5">text</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-xs text-zinc-600 leading-relaxed line-clamp-2">
          ${escapeHtml(theme.description)}
        </p>

        <!-- Typography & Radius Spec -->
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
          <div class="bg-zinc-50 p-1.5 rounded-sm border border-zinc-200 min-w-0">
            <span class="text-zinc-400 block text-[9px] uppercase">Font:</span>
            <span class="text-zinc-800 font-semibold truncate block" title="${escapeHtml(theme.font)}">${escapeHtml(theme.font)}</span>
          </div>
          <div class="bg-zinc-50 p-1.5 rounded-sm border border-zinc-200 min-w-0">
            <span class="text-zinc-400 block text-[9px] uppercase">Radius:</span>
            <span class="text-zinc-800 font-semibold truncate block" title="${escapeHtml(theme.radius)}">${escapeHtml(theme.radius)}</span>
          </div>
        </div>

        <!-- Principles Badges -->
        <div class="flex flex-wrap gap-1 pt-1">
          ${theme.principles.map(p => `
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-zinc-100 text-zinc-700 border border-zinc-200">
              • ${escapeHtml(p)}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Bottom Actions -->
      <div class="grid grid-cols-2 gap-2 pt-4 mt-3 border-t border-zinc-200">
        <button 
          type="button" 
          class="btn-card-preview px-2.5 py-1.5 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 rounded-sm text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer" 
          data-theme-id="${theme.id}"
        >
          <i data-lucide="file-text" class="w-3.5 h-3.5 text-zinc-500"></i>
          <span>Previzualizează</span>
        </button>
        <button 
          type="button" 
          class="btn-card-activate px-2.5 py-1.5 ${isActive ? 'bg-emerald-700 text-white font-semibold' : 'bg-zinc-900 hover:bg-black text-white'} rounded-sm text-xs font-medium transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer" 
          data-theme-id="${theme.id}"
        >
          <i data-lucide="${isActive ? 'check-check' : 'check'}" class="w-3.5 h-3.5"></i>
          <span>${isActive ? 'Temă Activă' : 'Activează'}</span>
        </button>
      </div>
    `;

    const previewBtn = card.querySelector(".btn-card-preview");
    if (previewBtn) {
      previewBtn.addEventListener("click", () => {
        openThemeSpecModal(theme.id);
      });
    }

    const mockupFrame = card.querySelector(".theme-mockup-frame");
    if (mockupFrame) {
      mockupFrame.addEventListener("click", () => {
        openThemeSpecModal(theme.id);
      });
    }

    const activateBtn = card.querySelector(".btn-card-activate");
    if (activateBtn) {
      activateBtn.addEventListener("click", () => {
        selectThemePreset(theme.id);
      });
    }

    el.themesGridContainer.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

// Trigger Live Preview
let debounceTimer;
function triggerPreview() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    try {
      const payload = {
        targetCli: state.targetCli,
        scope: state.scope,
        agentSkills: state.agentSkills,
        ponytail: state.ponytail,
        headroom: state.headroom,
        graphify: state.graphify,
        designSuite: state.designSuite,
        cybersecurity: state.cybersecurity,
        projectRules: state.projectRules
      };

      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.ok) {
        state.previewFiles = json.data.files;
        renderFileTree(state.previewFiles);
        el.previewCountBadge.textContent = state.previewFiles.length;

        const totalBytes = state.previewFiles.reduce((acc, f) => acc + f.size, 0);
        el.totalSizeLabel.textContent = `${(totalBytes / 1024).toFixed(1)} KB`;

        if (state.previewFiles.length > 0) {
          if (state.selectedFileIndex >= state.previewFiles.length) {
            state.selectedFileIndex = 0;
          }
          viewFile(state.selectedFileIndex);
        } else {
          el.viewerFilePath.textContent = "Niciun fișier configurat";
          el.viewerCodeContent.textContent = "";
        }
      }
    } catch (err) {
      console.error("Preview error:", err);
    }
  }, 100);
}

// Render File Tree
function renderFileTree(files) {
  el.filesTreeList.innerHTML = "";

  // Set active file route on the indicator bar
  if (files && files[state.selectedFileIndex] && el.treeHoverRouteText) {
    el.treeHoverRouteText.textContent = getFullRoute(files[state.selectedFileIndex].path);
  }

  files.forEach((file, index) => {
    const fullRoute = getFullRoute(file.path);
    const item = document.createElement("div");
    item.className = `file-tree-item px-3 py-2 rounded-sm cursor-pointer flex items-center justify-between gap-2 text-xs transition ${
      index === state.selectedFileIndex ? "active font-semibold text-zinc-950 bg-zinc-100 border-zinc-900" : "text-zinc-600 hover:bg-zinc-50 border-transparent"
    }`;
    item.title = `Ruta locală: ${fullRoute}`;
    item.dataset.fullRoute = fullRoute;

    let iconName = "file-text";
    let iconColor = "text-zinc-500";
    let badgeColor = "bg-zinc-100 text-zinc-600 border border-zinc-200";

    if (file.category === "rule") {
      iconName = "shield-check";
      iconColor = "text-zinc-900";
      badgeColor = "bg-zinc-100 text-zinc-900 border border-zinc-300";
    } else if (file.category === "skill") {
      iconName = "sparkles";
      iconColor = "text-zinc-900";
      badgeColor = "bg-zinc-100 text-zinc-900 border border-zinc-300";
    } else if (file.category === "design") {
      iconName = "palette";
      iconColor = "text-zinc-900";
      badgeColor = "bg-zinc-100 text-zinc-900 border border-zinc-300";
    } else if (file.category === "security") {
      iconName = "shield-alert";
      iconColor = "text-zinc-900";
      badgeColor = "bg-zinc-200 text-zinc-950 border border-zinc-400";
    } else if (file.category === "compression") {
      iconName = "minimize-2";
      iconColor = "text-zinc-900";
      badgeColor = "bg-zinc-200 text-zinc-950 border border-zinc-400";
    } else if (file.category === "config") {
      iconName = "settings";
      iconColor = "text-zinc-700";
      badgeColor = "bg-zinc-100 text-zinc-700 border border-zinc-200";
    } else if (file.category === "script") {
      iconName = "terminal";
      iconColor = "text-zinc-900";
      badgeColor = "bg-zinc-100 text-zinc-900 border border-zinc-300";
    } else if (file.category === "workflow") {
      iconName = "git-merge";
      iconColor = "text-zinc-700";
      badgeColor = "bg-zinc-100 text-zinc-700 border border-zinc-200";
    }

    item.innerHTML = `
      <div class="flex items-center gap-2.5 truncate flex-1 min-w-0">
        <i data-lucide="${iconName}" class="w-3.5 h-3.5 ${iconColor} shrink-0"></i>
        <div class="truncate flex-1 min-w-0">
          <span class="font-mono text-xs truncate block">${escapeHtml(file.path)}</span>
        </div>
      </div>
      <span class="text-[9px] font-mono px-2 py-0.5 rounded-sm font-semibold ${badgeColor} whitespace-nowrap uppercase tracking-wider shrink-0">${file.category}</span>
    `;

    // Hover listeners for instant full route visibility
    item.addEventListener("mouseenter", (e) => {
      if (el.treeHoverRouteText) {
        el.treeHoverRouteText.textContent = fullRoute;
      }
      showRouteTooltip(e, fullRoute, file.category);
    });

    item.addEventListener("mousemove", (e) => {
      moveRouteTooltip(e);
    });

    item.addEventListener("mouseleave", () => {
      hideRouteTooltip();
      if (state.previewFiles[state.selectedFileIndex] && el.treeHoverRouteText) {
        el.treeHoverRouteText.textContent = getFullRoute(state.previewFiles[state.selectedFileIndex].path);
      }
    });

    item.addEventListener("click", () => {
      state.selectedFileIndex = index;
      renderFileTree(state.previewFiles);
      viewFile(index);
    });

    el.filesTreeList.appendChild(item);
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Display File in Viewer
function viewFile(index) {
  const file = state.previewFiles[index];
  if (!file) return;

  const fullRoute = getFullRoute(file.path);
  el.viewerFilePath.textContent = file.path;
  el.viewerFilePath.title = `Ruta locală: ${fullRoute}`;
  el.viewerFileTag.textContent = file.category.toUpperCase();
  el.viewerCodeContent.textContent = file.content;
  if (el.treeHoverRouteText) {
    el.treeHoverRouteText.textContent = fullRoute;
  }
}

// Inspect Directory
async function inspectDirectory(targetDir) {
  try {
    el.dirStatusBadge.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i> Verificare...`;
    if (window.lucide) lucide.createIcons();
    const res = await fetch("/api/inspect-path", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetDir })
    });
    const json = await res.json();
    if (json.ok) {
      updateDirectoryBadge(json.data);
    }
  } catch (err) {
    el.dirStatusBadge.innerHTML = `<span class="text-red-400">Eroare verificare</span>`;
  }
}

// Update Directory Status Badge
function updateDirectoryBadge(data) {
  if (!data.exists) {
    el.dirStatusBadge.className = "px-3 py-1.5 rounded-sm bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-2 font-mono text-xs";
    el.dirStatusBadge.innerHTML = `<i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-amber-600"></i> Director nou (va fi creat)`;
    if (window.lucide) lucide.createIcons();
    return;
  }

  const { detectedConfigs, isGitRepo } = data;
  const tags = [];
  if (isGitRepo) tags.push("git");
  if (detectedConfigs.hasAgentsMd) tags.push("AGENTS.md");
  if (detectedConfigs.hasGeminiMd) tags.push("GEMINI.md");
  if (detectedConfigs.hasClaudeMd) tags.push("CLAUDE.md");
  if (detectedConfigs.hasMcpConfig) tags.push("MCP");
  if (detectedConfigs.skillsCount > 0) tags.push(`${detectedConfigs.skillsCount} skills`);

  el.dirStatusBadge.className = "px-3 py-1.5 rounded-sm bg-zinc-100 text-zinc-900 border border-zinc-300 flex items-center gap-2 font-mono text-xs font-semibold";
  el.dirStatusBadge.innerHTML = `
    <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-zinc-900"></i>
    <span>Valid</span>
    ${tags.length > 0 ? `<span class="text-[10px] text-zinc-500 ml-1 font-normal">(${tags.join(", ")})</span>` : ""}
  `;
  if (window.lucide) lucide.createIcons();
}

// Apply Config to Target Project
async function applyConfiguration() {
  try {
    const targetDir = el.targetDirInput.value.trim() || state.targetDir;
    showToast("Se scriu fișierele pe disc...", "info");

    const payload = {
      targetDir,
      targetCli: state.targetCli,
      scope: state.scope,
      agentSkills: state.agentSkills,
      ponytail: state.ponytail,
      headroom: state.headroom,
      graphify: state.graphify,
      designSuite: state.designSuite,
      cybersecurity: state.cybersecurity,
      projectRules: state.projectRules
    };

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (json.ok && json.data.success) {
      showToast(`Succes! ${json.data.writtenFiles.length} fișiere create în ${targetDir}`, "success");
      await inspectDirectory(targetDir);
    } else {
      showToast(`Eroare: ${json.error || "Nu s-au putut scrie fișierele"}`, "error");
    }
  } catch (err) {
    showToast(`Eroare server: ${err.message}`, "error");
  }
}

// Stream terminal command
function runTerminalCommand(cmd) {
  if (!cmd || !cmd.trim()) return;
  const targetDir = el.targetDirInput.value.trim() || state.targetDir;

  el.terminalScreen.textContent = `==> Execuție: ${cmd}\n==> Director de lucru: ${targetDir}\n----------------------------------------\n`;

  const url = `/api/stream-command?cmd=${encodeURIComponent(cmd)}&cwd=${encodeURIComponent(targetDir)}`;
  const eventSource = new EventSource(url);

  eventSource.addEventListener("output", (e) => {
    const data = JSON.parse(e.data);
    el.terminalScreen.textContent += data.text;
    el.terminalScreen.scrollTop = el.terminalScreen.scrollHeight;
  });

  eventSource.addEventListener("complete", (e) => {
    const data = JSON.parse(e.data);
    el.terminalScreen.textContent += `\n----------------------------------------\n==> Comandă finalizată cu codul de ieșire: ${data.code} (${data.success ? "SUCCES" : "EROARE"})\n`;
    el.terminalScreen.scrollTop = el.terminalScreen.scrollHeight;
    eventSource.close();
    inspectDirectory(targetDir);
  });

  eventSource.onerror = (err) => {
    el.terminalScreen.textContent += `\n[Eroare conexiune stream SSE]\n`;
    eventSource.close();
  };
}

// Toast notification helper
function showToast(msg, type = "success") {
  el.toastMsg.textContent = msg;

  if (type === "success") {
    el.toastIconContainer.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-zinc-900"></i>`;
  } else if (type === "info") {
    el.toastIconContainer.innerHTML = `<i data-lucide="info" class="w-4 h-4 text-zinc-700"></i>`;
  } else {
    el.toastIconContainer.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4 text-red-600"></i>`;
  }
  if (window.lucide) lucide.createIcons();

  el.toast.classList.remove("translate-y-20", "opacity-0");
  setTimeout(() => {
    el.toast.classList.add("translate-y-20", "opacity-0");
  }, 4000);
}

// ==========================================
// SAVED PROJECTS (Editable Bookmarks)
// ==========================================
async function loadSavedProjects() {
  try {
    const res = await fetch("/api/saved-projects");
    const json = await res.json();
    if (json.ok) {
      state.savedProjects = json.data;
      if (el.savedProjectsCount) {
        el.savedProjectsCount.textContent = state.savedProjects.length;
      }
    }
  } catch (err) {
    console.error("Failed to load saved projects:", err);
  }
}

function openSavedProjectsModal() {
  el.modalSavedProjects.classList.remove("hidden");
  renderSavedProjectsList();
  if (window.lucide) lucide.createIcons();
}

function closeSavedProjectsModal() {
  el.modalSavedProjects.classList.add("hidden");
  resetSpForm();
}

function resetSpForm() {
  el.spIdInput.value = "";
  el.spNameInput.value = "";
  el.spPathInput.value = "";
  el.spFormTitle.textContent = "Adaugă / Editează Proiect";
  el.spBtnSaveLabel.textContent = "Salvează în Listă";
  el.spBtnCancelEdit.classList.add("hidden");
}

function renderSavedProjectsList() {
  if (!el.savedProjectsListContainer) return;
  el.savedProjectsListContainer.innerHTML = "";

  if (state.savedProjects.length === 0) {
    el.savedProjectsListContainer.innerHTML = `
      <div class="p-6 text-center text-xs text-zinc-500 bg-zinc-50 border border-dashed border-zinc-300 rounded-sm">
        Niciun proiect salvat. Folosește formularul de mai sus pentru a salva un proiect.
      </div>
    `;
    return;
  }

  state.savedProjects.forEach(proj => {
    const isCurrent = proj.path === el.targetDirInput.value.trim();
    const item = document.createElement("div");
    item.className = `p-3 rounded-sm border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
      isCurrent ? "bg-zinc-100/90 border-zinc-400 shadow-xs" : "bg-white border-zinc-200 hover:border-zinc-300"
    }`;

    item.innerHTML = `
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-zinc-950">${escapeHtml(proj.name)}</span>
          ${isCurrent ? `<span class="px-1.5 py-0.2 bg-zinc-900 text-white text-[10px] rounded-sm font-mono font-medium">Activ</span>` : ""}
        </div>
        <div class="text-[11px] font-mono text-zinc-600 truncate mt-0.5" title="${escapeHtml(proj.path)}">
          ${escapeHtml(proj.path)}
        </div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button 
          type="button" 
          class="btn-sp-load px-2.5 py-1.5 bg-zinc-900 hover:bg-black text-white rounded-sm text-xs font-medium transition flex items-center gap-1 shadow-sm"
          title="Încarcă acest proiect în Omnibar"
        >
          <i data-lucide="check" class="w-3 h-3"></i>
          <span>Încarcă</span>
        </button>
        <button 
          type="button" 
          class="btn-sp-edit px-2 py-1.5 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 rounded-sm text-xs font-medium transition"
          title="Modifică datele proiectului"
        >
          <i data-lucide="pencil" class="w-3 h-3"></i>
        </button>
        <button 
          type="button" 
          class="btn-sp-delete px-2 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-zinc-300 hover:border-red-300 rounded-sm text-xs font-medium transition"
          title="Șterge proiectul salvat"
        >
          <i data-lucide="trash-2" class="w-3 h-3"></i>
        </button>
      </div>
    `;

    const btnLoad = item.querySelector(".btn-sp-load");
    btnLoad.addEventListener("click", () => {
      el.targetDirInput.value = proj.path;
      state.targetDir = proj.path;
      inspectDirectory(proj.path);
      triggerPreview();
      closeSavedProjectsModal();
      showToast(`Proiect activat: ${proj.name}`);
    });

    const btnEdit = item.querySelector(".btn-sp-edit");
    btnEdit.addEventListener("click", () => {
      el.spIdInput.value = proj.id;
      el.spNameInput.value = proj.name;
      el.spPathInput.value = proj.path;
      el.spFormTitle.textContent = `Editează Proiect: ${proj.name}`;
      el.spBtnSaveLabel.textContent = "Actualizează Proiect";
      el.spBtnCancelEdit.classList.remove("hidden");
      el.spNameInput.focus();
    });

    const btnDelete = item.querySelector(".btn-sp-delete");
    btnDelete.addEventListener("click", async () => {
      if (confirm(`Sigur doriți să ștergeți "${proj.name}" din lista de proiecte salvate?`)) {
        await deleteSavedProject(proj.id);
      }
    });

    el.savedProjectsListContainer.appendChild(item);
  });

  if (window.lucide) lucide.createIcons();
}

async function saveOrUpdateProject() {
  const id = el.spIdInput.value.trim();
  const name = el.spNameInput.value.trim();
  const projPath = el.spPathInput.value.trim();

  if (!projPath) {
    showToast("Calea proiectului este obligatorie!", "error");
    el.spPathInput.focus();
    return;
  }

  try {
    const res = await fetch("/api/saved-projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id || undefined, name, path: projPath })
    });
    const json = await res.json();
    if (json.ok) {
      state.savedProjects = json.data;
      el.savedProjectsCount.textContent = state.savedProjects.length;
      resetSpForm();
      renderSavedProjectsList();
      showToast(id ? "Proiect actualizat cu succes!" : "Proiect salvat în listă!");
    } else {
      showToast(json.error || "Eroare la salvare", "error");
    }
  } catch (err) {
    showToast(`Eroare: ${err.message}`, "error");
  }
}

async function deleteSavedProject(id) {
  try {
    const res = await fetch(`/api/saved-projects/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
    const json = await res.json();
    if (json.ok) {
      state.savedProjects = json.data;
      el.savedProjectsCount.textContent = state.savedProjects.length;
      if (el.spIdInput.value === id) resetSpForm();
      renderSavedProjectsList();
      showToast("Proiect șters din listă.", "info");
    }
  } catch (err) {
    showToast(`Eroare: ${err.message}`, "error");
  }
}

// ==========================================
// FILE EXPLORER (Native OS & In-App Fallback)
// ==========================================
async function openDirectoryPicker() {
  try {
    showToast("Se deschide exploratorul de foldere...", "info");
    const currentDir = el.targetDirInput.value.trim() || state.targetDir;
    const res = await fetch("/api/browse-directory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentDir })
    });
    const json = await res.json();

    if (json.ok && json.path) {
      el.targetDirInput.value = json.path;
      state.targetDir = json.path;
      await inspectDirectory(json.path);
      triggerPreview();
      showToast(`Folder selectat: ${json.path}`);
      return;
    }

    if (json.cancelled) {
      // User closed or cancelled native dialog
      return;
    }

    // If native dialog is not supported or failed, open in-app browser modal
    openFsBrowser(currentDir);
  } catch (err) {
    console.warn("Native browse failed, opening in-app browser:", err);
    openFsBrowser(el.targetDirInput.value.trim() || state.targetDir);
  }
}

function openFsBrowser(initialDir) {
  el.modalFsBrowser.classList.remove("hidden");
  loadFsDirectory(initialDir || process.cwd());
}

function closeFsBrowser() {
  el.modalFsBrowser.classList.add("hidden");
}

async function loadFsDirectory(dir) {
  try {
    el.fsDirsContainer.innerHTML = `<div class="p-6 text-center text-xs text-zinc-500"><i data-lucide="loader-2" class="w-4 h-4 animate-spin inline-block mr-2"></i> Se citesc directoarele...</div>`;
    if (window.lucide) lucide.createIcons();

    const res = await fetch("/api/browse-fs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dir })
    });
    const json = await res.json();

    if (!json.ok) {
      el.fsDirsContainer.innerHTML = `<div class="p-4 text-xs text-red-500">Eroare: ${escapeHtml(json.error)}</div>`;
      return;
    }

    state.fsBrowser.currentPath = json.currentPath;
    state.fsBrowser.parentPath = json.parentPath;

    el.fsCurrentPathInput.value = json.currentPath;
    el.fsSelectedHint.textContent = `Cale: ${json.currentPath}`;

    if (json.isRoot || !json.parentPath) {
      el.fsBtnParent.disabled = true;
      el.fsBtnParent.classList.add("opacity-40", "cursor-not-allowed");
    } else {
      el.fsBtnParent.disabled = false;
      el.fsBtnParent.classList.remove("opacity-40", "cursor-not-allowed");
    }

    el.fsDirsContainer.innerHTML = "";
    if (json.directories.length === 0) {
      el.fsDirsContainer.innerHTML = `<div class="p-6 text-center text-xs text-zinc-500 italic">Niciun subdirector în această locație.</div>`;
      return;
    }

    json.directories.forEach(d => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "w-full text-left p-2.5 rounded-sm hover:bg-zinc-100 border border-transparent hover:border-zinc-300 transition flex items-center gap-2.5 group";
      btn.innerHTML = `
        <i data-lucide="folder" class="w-4 h-4 text-zinc-700 group-hover:text-zinc-950 shrink-0"></i>
        <span class="text-xs font-medium text-zinc-800 group-hover:text-zinc-950 truncate">${escapeHtml(d.name)}</span>
      `;
      btn.addEventListener("click", () => {
        loadFsDirectory(d.path);
      });
      el.fsDirsContainer.appendChild(btn);
    });

    if (window.lucide) lucide.createIcons();
  } catch (err) {
    el.fsDirsContainer.innerHTML = `<div class="p-4 text-xs text-red-500">Eroare încărcare directoare: ${escapeHtml(err.message)}</div>`;
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Target Directory Controls
  el.btnBrowseFolder.addEventListener("click", () => {
    openDirectoryPicker();
  });

  el.btnSavedProjectsToggle.addEventListener("click", () => {
    openSavedProjectsModal();
  });

  el.btnBookmarkCurrent.addEventListener("click", () => {
    const currentPath = el.targetDirInput.value.trim();
    if (!currentPath) {
      showToast("Introduceți o cale validă în Omnibar pentru salvare", "error");
      return;
    }
    openSavedProjectsModal();
    resetSpForm();
    el.spPathInput.value = currentPath;
    const folderName = currentPath.split("/").filter(Boolean).pop() || "Proiect";
    el.spNameInput.value = folderName.charAt(0).toUpperCase() + folderName.slice(1);
    el.spNameInput.focus();
  });

  el.btnInspect.addEventListener("click", () => {
    const dir = el.targetDirInput.value.trim();
    if (dir) inspectDirectory(dir);
  });

  el.btnCurrentDir.addEventListener("click", async () => {
    await setDefaultTargetDir();
  });

  el.targetDirInput.addEventListener("change", () => {
    const dir = el.targetDirInput.value.trim();
    if (dir) inspectDirectory(dir);
    if (state.previewFiles.length > 0) renderFileTree(state.previewFiles);
    renderSkillsList();
  });
  el.targetDirInput.addEventListener("input", () => {
    if (state.previewFiles.length > 0) renderFileTree(state.previewFiles);
  });

  // Modal Saved Projects Events
  el.modalSpClose.addEventListener("click", closeSavedProjectsModal);
  el.modalSpBtnDismiss.addEventListener("click", closeSavedProjectsModal);
  el.modalSavedProjects.addEventListener("click", (e) => {
    if (e.target === el.modalSavedProjects) closeSavedProjectsModal();
  });
  el.spBtnSave.addEventListener("click", saveOrUpdateProject);
  el.spBtnCancelEdit.addEventListener("click", resetSpForm);

  // Modal FS Browser Events
  el.modalFsClose.addEventListener("click", closeFsBrowser);
  el.modalFsBtnCancel.addEventListener("click", closeFsBrowser);
  el.modalFsBrowser.addEventListener("click", (e) => {
    if (e.target === el.modalFsBrowser) closeFsBrowser();
  });
  el.fsBtnParent.addEventListener("click", () => {
    if (state.fsBrowser.parentPath) {
      loadFsDirectory(state.fsBrowser.parentPath);
    }
  });
  el.fsBtnGo.addEventListener("click", () => {
    const p = el.fsCurrentPathInput.value.trim();
    if (p) loadFsDirectory(p);
  });
  el.fsCurrentPathInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const p = el.fsCurrentPathInput.value.trim();
      if (p) loadFsDirectory(p);
    }
  });
  el.fsBtnConfirmSelect.addEventListener("click", () => {
    if (state.fsBrowser.currentPath) {
      el.targetDirInput.value = state.fsBrowser.currentPath;
      state.targetDir = state.fsBrowser.currentPath;
      inspectDirectory(state.fsBrowser.currentPath);
      triggerPreview();
      closeFsBrowser();
      showToast(`Folder selectat: ${state.fsBrowser.currentPath}`);
    }
  });

  // CLI Target Buttons
  el.cliBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      el.cliBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.targetCli = btn.dataset.cli;
      triggerPreview();
    });
  });

  // Scope Buttons
  el.scopeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      el.scopeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.scope = btn.dataset.scope;
      triggerPreview();
    });
  });

  // Skills Enabled Toggle
  el.skillsEnabled.addEventListener("change", () => {
    state.agentSkills.enabled = el.skillsEnabled.checked;
    el.skillsControls.style.opacity = el.skillsEnabled.checked ? "1" : "0.4";
    el.skillsControls.style.pointerEvents = el.skillsEnabled.checked ? "auto" : "none";
    triggerPreview();
  });

  // Skills Preset Buttons
  el.skillPresetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const preset = btn.dataset.preset;
      state.agentSkills.mode = preset;
      updatePresetButtonUI(preset);
      renderSkillsList();
      triggerPreview();
    });
  });

  // Ponytail Controls
  el.ponytailEnabled.addEventListener("change", () => {
    state.ponytail.enabled = el.ponytailEnabled.checked;
    el.ponytailControls.style.opacity = el.ponytailEnabled.checked ? "1" : "0.4";
    el.ponytailControls.style.pointerEvents = el.ponytailEnabled.checked ? "auto" : "none";
    triggerPreview();
  });

  el.ponytailModeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      el.ponytailModeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.ponytail.mode = btn.dataset.mode;
      triggerPreview();
    });
  });

  el.ponytailSkillsCheckbox.addEventListener("change", () => {
    state.ponytail.includeSkills = el.ponytailSkillsCheckbox.checked;
    triggerPreview();
  });

  // Headroom Controls
  el.headroomEnabled.addEventListener("change", () => {
    state.headroom.enabled = el.headroomEnabled.checked;
    el.headroomControls.style.opacity = el.headroomEnabled.checked ? "1" : "0.4";
    el.headroomControls.style.pointerEvents = el.headroomEnabled.checked ? "auto" : "none";
    triggerPreview();
  });

  el.headroomMcpCheckbox.addEventListener("change", () => {
    state.headroom.includeMcp = el.headroomMcpCheckbox.checked;
    triggerPreview();
  });

  el.headroomSkillCheckbox.addEventListener("change", () => {
    state.headroom.includeSkill = el.headroomSkillCheckbox.checked;
    triggerPreview();
  });

  el.headroomRulesCheckbox.addEventListener("change", () => {
    state.headroom.includeRules = el.headroomRulesCheckbox.checked;
    triggerPreview();
  });

  // Graphify Controls
  el.graphifyEnabled.addEventListener("change", () => {
    state.graphify.enabled = el.graphifyEnabled.checked;
    el.graphifyControls.style.opacity = el.graphifyEnabled.checked ? "1" : "0.4";
    el.graphifyControls.style.pointerEvents = el.graphifyEnabled.checked ? "auto" : "none";
    triggerPreview();
  });

  el.graphifyMcpCheckbox.addEventListener("change", () => {
    state.graphify.includeMcp = el.graphifyMcpCheckbox.checked;
    triggerPreview();
  });

  el.mcpRunnerRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        state.graphify.mcpCommand = radio.value;
        triggerPreview();
      }
    });
  });

  // Design Suite Controls
  el.designEnabled.addEventListener("change", () => {
    state.designSuite.enabled = el.designEnabled.checked;
    el.designControls.style.opacity = el.designEnabled.checked ? "1" : "0.4";
    el.designControls.style.pointerEvents = el.designEnabled.checked ? "auto" : "none";
    triggerPreview();
  });

  el.designTasteCheckbox.addEventListener("change", () => {
    state.designSuite.tasteSkill = el.designTasteCheckbox.checked;
    triggerPreview();
  });

  el.designImpeccableCheckbox.addEventListener("change", () => {
    state.designSuite.impeccable = el.designImpeccableCheckbox.checked;
    triggerPreview();
  });

  el.designEmilCheckbox.addEventListener("change", () => {
    state.designSuite.emilAnimations = el.designEmilCheckbox.checked;
    triggerPreview();
  });

  el.designMdSelect.addEventListener("change", () => {
    state.designSuite.designMdPreset = el.designMdSelect.value;
    updateActiveThemeBadge();
    renderThemesGallery();
    triggerPreview();
  });

  el.dialVariance.addEventListener("input", () => {
    const val = parseInt(el.dialVariance.value, 10);
    state.designSuite.designVariance = val;
    el.labelVariance.textContent = val;
    triggerPreview();
  });

  el.dialMotion.addEventListener("input", () => {
    const val = parseInt(el.dialMotion.value, 10);
    state.designSuite.motionIntensity = val;
    el.labelMotion.textContent = val;
    triggerPreview();
  });

  el.dialDensity.addEventListener("input", () => {
    const val = parseInt(el.dialDensity.value, 10);
    state.designSuite.visualDensity = val;
    el.labelDensity.textContent = val;
    triggerPreview();
  });

  // Cybersecurity Suite Controls
  el.securityEnabled.addEventListener("change", () => {
    state.cybersecurity.enabled = el.securityEnabled.checked;
    el.securityControls.style.opacity = el.securityEnabled.checked ? "1" : "0.4";
    el.securityControls.style.pointerEvents = el.securityEnabled.checked ? "auto" : "none";
    triggerPreview();
  });

  el.secAppsecCheckbox.addEventListener("change", () => {
    state.cybersecurity.appsecAudit = el.secAppsecCheckbox.checked;
    triggerPreview();
  });

  el.secThreatCheckbox.addEventListener("change", () => {
    state.cybersecurity.threatModeling = el.secThreatCheckbox.checked;
    triggerPreview();
  });

  el.secSecretCheckbox.addEventListener("change", () => {
    state.cybersecurity.secretScanning = el.secSecretCheckbox.checked;
    triggerPreview();
  });

  el.secDepCheckbox.addEventListener("change", () => {
    state.cybersecurity.depAudit = el.secDepCheckbox.checked;
    triggerPreview();
  });

  // Stack & Project Rules
  el.stackSelect.addEventListener("change", () => {
    state.projectRules.stack = el.stackSelect.value;
    triggerPreview();
  });

  el.ruleTests.addEventListener("change", () => {
    state.projectRules.testCoverage = el.ruleTests.checked;
    triggerPreview();
  });

  el.ruleCommits.addEventListener("change", () => {
    state.projectRules.gitCommitConventions = el.ruleCommits.checked;
    triggerPreview();
  });

  el.customRulesText.addEventListener("input", () => {
    state.projectRules.customRules = el.customRulesText.value;
    triggerPreview();
  });

  // Tab Navigation
  el.tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      el.tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tabId = btn.dataset.tab;
      el.tabPanels.forEach(panel => {
        panel.classList.add("hidden");
      });
      const targetPanel = document.getElementById(`tab-${tabId}`);
      if (targetPanel) {
        targetPanel.classList.remove("hidden");
      }

      // Responsive layout adjustment: if themes tab is active, expand to full width (dedicated page)
      if (el.configControlsCol && el.workspaceTabsCol) {
        if (tabId === "themes") {
          el.configControlsCol.classList.add("hidden");
          el.workspaceTabsCol.classList.remove("lg:col-span-7");
          el.workspaceTabsCol.classList.add("lg:col-span-12");
          renderThemesGallery();
        } else {
          el.configControlsCol.classList.remove("hidden");
          el.workspaceTabsCol.classList.remove("lg:col-span-12");
          el.workspaceTabsCol.classList.add("lg:col-span-7");
        }
      }
    });
  });

  // Copy Code Button
  el.btnCopyCode.addEventListener("click", () => {
    const code = el.viewerCodeContent.textContent;
    if (code) {
      navigator.clipboard.writeText(code);
      showToast("Conținutul fișierului a fost copiat în clipboard!", "success");
    }
  });

  // Copy Full Route Button
  if (el.btnCopyRoute) {
    el.btnCopyRoute.addEventListener("click", () => {
      const text = el.treeHoverRouteText ? el.treeHoverRouteText.textContent.trim() : "";
      if (text && !text.startsWith("Plimbă")) {
        navigator.clipboard.writeText(text);
        showToast("Ruta locală a fost copiată în clipboard!", "success");
      }
    });
  }

  // Apply Buttons
  el.btnApplyQuick.addEventListener("click", applyConfiguration);
  el.btnApplyAction.addEventListener("click", applyConfiguration);

  // Run Install Script Button
  el.btnRunInstallScript.addEventListener("click", () => {
    // Switch to action tab if not already there
    document.querySelector('[data-tab="actions"]').click();
    runTerminalCommand("bash setup-ai-environment.sh");
  });

  // Custom Command Execution
  el.btnRunCmd.addEventListener("click", () => {
    const cmd = el.customCmdInput.value.trim();
    if (cmd) runTerminalCommand(cmd);
  });

  el.customCmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = el.customCmdInput.value.trim();
      if (cmd) runTerminalCommand(cmd);
    }
  });

  el.btnClearTerminal.addEventListener("click", () => {
    el.terminalScreen.textContent = "Consolă curățată.\n";
  });

  // Awesome-Design-MD Themes Gallery Events
  if (el.btnOpenThemesTab) {
    el.btnOpenThemesTab.addEventListener("click", () => {
      const themesTabBtn = document.querySelector('.tab-btn[data-tab="themes"]');
      if (themesTabBtn) themesTabBtn.click();
    });
  }

  if (el.btnBackToConfig) {
    el.btnBackToConfig.addEventListener("click", () => {
      const previewTabBtn = document.querySelector('.tab-btn[data-tab="preview"]');
      if (previewTabBtn) previewTabBtn.click();
    });
  }

  if (el.themeFilterBtns) {
    el.themeFilterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        el.themeFilterBtns.forEach(b => {
          b.classList.remove("active", "bg-zinc-900", "text-white", "border-zinc-900");
          b.classList.add("bg-white", "text-zinc-700", "border-zinc-300");
        });
        btn.classList.add("active", "bg-zinc-900", "text-white", "border-zinc-900");
        btn.classList.remove("bg-white", "text-zinc-700", "border-zinc-300");
        activeThemeFilter = btn.dataset.filter || "all";
        renderThemesGallery(activeThemeFilter, activeThemeSearch);
      });
    });
  }

  if (el.themesSearchInput) {
    el.themesSearchInput.addEventListener("input", (e) => {
      activeThemeSearch = e.target.value.trim().toLowerCase();
      renderThemesGallery(activeThemeFilter, activeThemeSearch);
    });
  }

  if (el.modalTabBtnStudio) {
    el.modalTabBtnStudio.addEventListener("click", () => switchModalTab("studio"));
  }

  if (el.modalTabBtnMarkdown) {
    el.modalTabBtnMarkdown.addEventListener("click", () => switchModalTab("markdown"));
  }

  if (el.modalThemeCopyCss) {
    el.modalThemeCopyCss.addEventListener("click", () => {
      const themes = (state.catalog && state.catalog.designSuite && state.catalog.designSuite.themes) || DEFAULT_AWESOME_THEMES;
      const t = themes.find(x => x.id === modalCurrentThemeId);
      if (t) {
        const cssVars = `:root {\n  --canvas: ${t.canvas};\n  --surface: ${t.surface};\n  --border: ${t.border};\n  --accent: ${t.accent};\n  --text-primary: ${t.text};\n  --text-muted: ${t.textMuted || "#8a8f98"};\n  --font-family: ${t.fontFamily || "'Inter', sans-serif"};\n  --radius: ${t.borderRadius || "6px"};\n}`;
        navigator.clipboard.writeText(cssVars);
        showToast(`Variabilele CSS :root pentru ${t.name} au fost copiate!`, "success");
      }
    });
  }

  if (el.modalThemeClose) {
    el.modalThemeClose.addEventListener("click", closeThemeSpecModal);
  }

  if (el.modalThemePreview) {
    el.modalThemePreview.addEventListener("click", (e) => {
      if (e.target === el.modalThemePreview) closeThemeSpecModal();
    });
  }

  if (el.modalThemeCopy) {
    el.modalThemeCopy.addEventListener("click", () => {
      const code = el.modalThemeCode ? el.modalThemeCode.textContent : "";
      if (code) {
        navigator.clipboard.writeText(code);
        showToast("Specificația Markdown DESIGN.md a fost copiată!", "success");
      }
    });
  }

  if (el.modalThemeActivate) {
    el.modalThemeActivate.addEventListener("click", () => {
      selectThemePreset(modalCurrentThemeId);
      closeThemeSpecModal();
    });
  }
}
