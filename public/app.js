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
  modalThemeActivate: document.getElementById("modal-theme-activate")
};

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
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

// Awesome-Design-MD Themes State & Fallback Catalog (12 Top Tech Brands)
let activeThemeFilter = "all";
let activeThemeSearch = "";
let modalCurrentThemeId = "linear";

const DEFAULT_AWESOME_THEMES = [
  {
    id: "linear",
    name: "Linear",
    brand: "Linear.app",
    tag: "Dark B2B Craft",
    stars: "115k+ ⭐",
    accent: "#5e6ad2",
    canvas: "#010102",
    surface: "#0f1011",
    border: "#23252a",
    text: "#f7f8f8",
    font: "Inter / SF Pro Display (-0.02em)",
    radius: "8px cards, 6px buttons",
    description: "Near-black obsidian canvas cu margini subtile de 1px hairline, accente lavandă folosite cu rigoare și densitate extremă.",
    principles: ["Zero drop-shadows grele", "Negative letter-spacing", "Micro-interacțiuni 150ms"],
    icon: "sliders",
    category: "dark dev"
  },
  {
    id: "apple",
    name: "Apple HIG",
    brand: "Apple Inc.",
    tag: "Content-First Clarity",
    stars: "115k+ ⭐",
    accent: "#0071e3",
    canvas: "#f5f5f7",
    surface: "#ffffff",
    border: "#d2d2d7",
    text: "#1d1d1f",
    font: "SF Pro / -apple-system",
    radius: "12px - 16px squircle",
    description: "Claritate umanistă orientată pe conținut, margini rotunjite squircle, spațiere generoasă și fundaluri cu blur ultra-subțire.",
    principles: ["Backdrop blur 20px", "Tipografie dinamică ierarhică", "Feedback haptic & tactil"],
    icon: "command",
    category: "light"
  },
  {
    id: "stripe",
    name: "Stripe",
    brand: "Stripe.com",
    tag: "Fintech Precision",
    stars: "115k+ ⭐",
    accent: "#635bff",
    canvas: "#f8f9fa",
    surface: "#ffffff",
    border: "#e6ebf1",
    text: "#0a2540",
    font: "Söhne / Inter, 500-600 weight",
    radius: "8px - 12px",
    description: "Estetică fintech de maximă încredere, accente indigo vibrante, umbre stratificate matematice și carduri impecabile.",
    principles: ["Umbre stratificate pe 2 nivele", "Contururi precise", "Albastru de siguranță financiară"],
    icon: "credit-card",
    category: "light dev"
  },
  {
    id: "vercel",
    name: "Vercel",
    brand: "Vercel.com",
    tag: "Stark Monochrome",
    stars: "115k+ ⭐",
    accent: "#0070f3",
    canvas: "#000000",
    surface: "#111111",
    border: "#333333",
    text: "#ffffff",
    font: "Geist Sans & Geist Mono",
    radius: "6px standard, 9999px pills",
    description: "Contrast maxim alb-negru (monocrom pur), rigoare geometrică absolută, tipografie Geist tehnică și accente albastru electric.",
    principles: ["Contrast WCAG AAA", "Grid tehnic strict", "Geist monospace integrat"],
    icon: "triangle",
    category: "dark dev"
  },
  {
    id: "github",
    name: "GitHub Primer",
    brand: "GitHub.com",
    tag: "Dev Telemetry",
    stars: "115k+ ⭐",
    accent: "#238636",
    canvas: "#0d1117",
    surface: "#161b22",
    border: "#30363d",
    text: "#e6edf3",
    font: "-apple-system / Segoe UI",
    radius: "6px standard, 3px badges",
    description: "Sistemul Primer de la GitHub: optimizat pentru programatori, diferențiere vizuală a diff-urilor și culori semantice clare de status.",
    principles: ["Status semantic verde/roșu/galben", "Fundaluri gri închis confortabile", "Tag-uri compacte"],
    icon: "git-branch",
    category: "dark dev"
  },
  {
    id: "supabase",
    name: "Supabase",
    brand: "Supabase.com",
    tag: "Emerald Backend",
    stars: "115k+ ⭐",
    accent: "#3ecf8e",
    canvas: "#171717",
    surface: "#1c1c1c",
    border: "#2e2e2e",
    text: "#ededed",
    font: "Circular / Fira Code",
    radius: "6px standard",
    description: "Design întunecat pentru baze de date & SQL: verde smarald neon, suprafețe obsidian și editor monospace integrat.",
    principles: ["Verde smarald radiant", "Tabele de date dense", "Contrast optim pentru cod"],
    icon: "database",
    category: "dark dev"
  },
  {
    id: "raycast",
    name: "Raycast",
    brand: "Raycast.com",
    tag: "Keyboard Launcher",
    stars: "115k+ ⭐",
    accent: "#ff6363",
    canvas: "#141416",
    surface: "#1f1f23",
    border: "#2c2c32",
    text: "#ffffff",
    font: "Inter / JetBrains Mono",
    radius: "8px - 10px",
    description: "Viteză fulgerătoare și precizie: accente roșu rubin, indicatoare pentru scurtături de tastatură și sticlă mată întunecată.",
    principles: ["Badge-uri Kbd de taste", "Focalizare rapidă", "Tranziții instant sub 100ms"],
    icon: "zap",
    category: "dark dev"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    brand: "TailwindLabs",
    tag: "Modern Utility Web",
    stars: "115k+ ⭐",
    accent: "#0ea5e9",
    canvas: "#0f172a",
    surface: "#1e293b",
    border: "#334155",
    text: "#f8fafc",
    font: "Inter / system-ui",
    radius: "8px rounded-md",
    description: "Estetica oficială modernă Tailwind: nuanțe slate, accente cyan/sky, carduri echilibrate și spațiere modulară armonioasă.",
    principles: ["Paletă Slate & Sky echilibrată", "Scală modulară 4px", "Componente aerisite"],
    icon: "wind",
    category: "dark dev"
  },
  {
    id: "notion",
    name: "Notion",
    brand: "Notion.so",
    tag: "Warm Editorial",
    stars: "115k+ ⭐",
    accent: "#2eaadc",
    canvas: "#f7f6f3",
    surface: "#ffffff",
    border: "#e3e2de",
    text: "#37352f",
    font: "ui-sans-serif & Lyon Serif",
    radius: "4px - 6px subtil",
    description: "Spațiu editorial minimalist cu aromă de hârtie caldă, nuanțe sepia, contrast relaxant pentru ochi și tipografie literară.",
    principles: ["Fundal cald ivory", "Linii subțiri sepia", "Fără distracții vizuale"],
    icon: "book-open",
    category: "light"
  },
  {
    id: "figma",
    name: "Figma",
    brand: "Figma.com",
    tag: "Creative Canvas",
    stars: "115k+ ⭐",
    accent: "#7b61ff",
    canvas: "#1e1e1e",
    surface: "#2c2c2c",
    border: "#383838",
    text: "#ffffff",
    font: "Inter Display",
    radius: "6px inspector panels",
    description: "Interfață de unelte profesionale de creație: fundal gri neutru pentru a evidenția creația, accent violet și controale numerice precise.",
    principles: ["Panouri flotante compacte", "Accent violet creator", "Feedback vizual la hover pe unelte"],
    icon: "pen-tool",
    category: "dark"
  },
  {
    id: "openai",
    name: "OpenAI ChatGPT",
    brand: "OpenAI",
    tag: "Conversational Slate",
    stars: "115k+ ⭐",
    accent: "#10a37f",
    canvas: "#202123",
    surface: "#343541",
    border: "#4d4d4f",
    text: "#ececf1",
    font: "Söhne / system-ui",
    radius: "8px - 12px pill",
    description: "Design conversațional axat pe lizibilitate: nuanțe neutre de ardezie (slate), accente mint green și bule de text confortabile.",
    principles: ["Lățime optimă de citire (max 768px)", "Accent verde mentă", "Bule chat fluide"],
    icon: "bot",
    category: "dark"
  },
  {
    id: "airbnb",
    name: "Airbnb",
    brand: "Airbnb.com",
    tag: "Consumer Trust",
    stars: "115k+ ⭐",
    accent: "#ff385c",
    canvas: "#ffffff",
    surface: "#f7f7f7",
    border: "#dddddd",
    text: "#222222",
    font: "Circular / -apple-system",
    radius: "12px - 16px rounded-xl",
    description: "Estetică de consum prietenoasă cu încredere maximă: accent coral/rausch recunoscut mondial, carduri rotunjite și spațiere confortabilă.",
    principles: ["Rausch Coral emblematic", "Umbre difuze mari", "Rază generoasă de 16px"],
    icon: "home",
    category: "light"
  }
];

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

function openThemeSpecModal(themeId) {
  modalCurrentThemeId = themeId;
  const themes = (state.catalog && state.catalog.designSuite && state.catalog.designSuite.themes) || DEFAULT_AWESOME_THEMES;
  const theme = themes.find(t => t.id === themeId) || { name: themeId, tag: "" };

  if (el.modalThemeTitle) {
    el.modalThemeTitle.textContent = `Specificație DESIGN.md: ${theme.name} (${theme.tag || theme.brand || ""})`;
  }

  let mdContent = "";
  if (state.catalog && state.catalog.designSuite && state.catalog.designSuite.presetDocs && state.catalog.designSuite.presetDocs[themeId]) {
    mdContent = state.catalog.designSuite.presetDocs[themeId];
  } else {
    mdContent = `# DESIGN.md - ${theme.name} Design System\n\n> Brand: ${theme.brand || theme.name}\n> Tag: ${theme.tag || ""}\n\n## Color Tokens\n- Accent: ${theme.accent}\n- Canvas: ${theme.canvas}\n- Surface: ${theme.surface}\n- Border: ${theme.border}\n- Text: ${theme.text}\n\n## Typography\n- Primary Font: ${theme.font}\n\n## Border Radius\n- Scale: ${theme.radius}\n\n## Core Principles\n${(theme.principles || []).map(p => `- ${p}`).join("\n")}`;
  }

  if (el.modalThemeCode) {
    el.modalThemeCode.textContent = mdContent;
  }

  if (el.modalThemeActivate) {
    if (state.designSuite.designMdPreset === themeId) {
      el.modalThemeActivate.innerHTML = `<i data-lucide="check-check" class="w-3.5 h-3.5"></i><span>Temă Deja Activă</span>`;
      el.modalThemeActivate.classList.add("opacity-80");
    } else {
      el.modalThemeActivate.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i><span>Activează această Temă</span>`;
      el.modalThemeActivate.classList.remove("opacity-80");
    }
  }

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

// Render Authentic Mini-Mockup of Page Elements for Each Brand
function renderThemeMockup(theme) {
  const { id, canvas, surface, border, text, accent } = theme;

  // Font family and typography per brand design system
  let fontCss = "font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;";
  if (id === "linear" || id === "figma" || id === "raycast") {
    fontCss = "font-family: 'Inter', -apple-system, sans-serif; letter-spacing: -0.02em;";
  } else if (id === "vercel") {
    fontCss = "font-family: 'JetBrains Mono', 'Geist Mono', monospace;";
  } else if (id === "supabase") {
    fontCss = "font-family: 'Fira Code', 'JetBrains Mono', monospace;";
  } else if (id === "notion") {
    fontCss = "font-family: 'Newsreader', Georgia, 'Times New Roman', serif;";
  } else if (id === "apple") {
    fontCss = "font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif;";
  } else if (id === "github") {
    fontCss = "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif;";
  }

  let mockupContent = "";

  if (id === "linear") {
    mockupContent = `
      <div class="flex items-center justify-between text-[10px] pb-2 border-b" style="border-color: ${border}">
        <span class="font-mono text-[9px] opacity-60">LIN-1048 • Cycle 42</span>
        <span class="px-1.5 py-0.5 text-[9px] font-mono rounded" style="background: ${accent}25; color: #8b95f6; border: 1px solid ${accent}50">In Progress</span>
      </div>
      <div class="pt-2">
        <h4 class="text-xs font-semibold tracking-tight leading-snug" style="color: ${text}">Migrate stream to ClickHouse</h4>
        <p class="text-[10px] opacity-70 pt-0.5 truncate">Zero dropped events across 12 partitions</p>
      </div>
      <div class="p-2 rounded mt-2 text-[10px] flex items-center justify-between" style="background: ${surface}; border: 1px solid ${border}">
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" style="background: #22c55e"></span>
          <span class="font-mono text-[9px]">16/16 fixtures passed</span>
        </div>
        <span class="text-[9px] font-mono opacity-60">P1 ⚡</span>
      </div>
      <div class="flex items-center justify-between pt-2.5 mt-0.5">
        <div class="flex items-center gap-1.5">
          <span class="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shadow-xs" style="background: ${accent}; color: #fff">AG</span>
          <span class="text-[9px] opacity-70 font-mono">Assigned</span>
        </div>
        <div class="px-2.5 py-1 text-[10px] font-medium shadow-xs" style="background: ${accent}; color: #ffffff; border-radius: 6px;">
          Update issue
        </div>
      </div>
    `;
  } else if (id === "apple") {
    mockupContent = `
      <div class="flex items-center justify-between pb-1.5 border-b" style="border-color: ${border}">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-[#ff5f56]"></span>
          <span class="w-2 h-2 rounded-full bg-[#ffbd2e]"></span>
          <span class="w-2 h-2 rounded-full bg-[#27c93f]"></span>
        </div>
        <span class="text-[10px] font-medium opacity-60">AirPlay & Display</span>
      </div>
      <div class="p-2.5 rounded-xl mt-2 shadow-xs" style="background: ${surface}; border: 1px solid ${border}">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[11px] font-semibold tracking-tight" style="color: ${text}">Studio Display Pro</span>
          <span class="w-4 h-4 rounded-full flex items-center justify-center text-[9px]" style="background: ${accent}15; color: ${accent}">
            🔊
          </span>
        </div>
        <div class="w-full h-2 bg-zinc-200/80 rounded-full overflow-hidden">
          <div class="h-full rounded-full" style="width: 76%; background: ${accent}"></div>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2">
        <span class="text-[9px] opacity-70 font-medium">Spatial Audio: On</span>
        <div class="px-3 py-1 text-[10px] font-semibold" style="background: ${accent}; color: #ffffff; border-radius: 9999px;">
          Connect
        </div>
      </div>
    `;
  } else if (id === "stripe") {
    mockupContent = `
      <div class="flex items-center justify-between text-[10px] pb-1.5 border-b" style="border-color: ${border}">
        <span class="font-medium opacity-60">Payments & Balances</span>
        <span class="px-1.5 py-0.2 rounded font-semibold text-[9px]" style="background: #eef2ff; color: ${accent}">Live mode</span>
      </div>
      <div class="p-2.5 rounded-lg mt-2 shadow-xs" style="background: ${surface}; border: 1px solid ${border}; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 6px rgba(0,0,0,0.02);">
        <span class="text-[9px] opacity-60 uppercase tracking-wider block font-semibold">Net volume</span>
        <div class="flex items-baseline gap-2 mt-0.5">
          <span class="text-sm font-bold tracking-tight" style="color: ${text}">$84,250.00</span>
          <span class="text-[9px] font-bold text-emerald-600">+14.2%</span>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2">
        <div class="flex items-center gap-1.5 text-[10px]">
          <span class="font-bold text-[9px] px-1 py-0.2 rounded bg-zinc-200/60 font-mono">VISA</span>
          <span class="font-mono text-[9px] opacity-70">•••• 4242</span>
        </div>
        <div class="px-3 py-1 text-[10px] font-semibold shadow-xs" style="background: ${accent}; color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(99,91,255,0.25)">
          Payout
        </div>
      </div>
    `;
  } else if (id === "vercel") {
    mockupContent = `
      <div class="flex items-center justify-between text-[10px] pb-1.5 border-b font-mono" style="border-color: ${border}">
        <span class="flex items-center gap-1.5 font-bold" style="color: ${text}">
          <span>▲</span> my-next-app
        </span>
        <span class="text-[9px] text-emerald-400 font-mono">● Ready (420ms)</span>
      </div>
      <div class="p-2 rounded mt-2 font-mono text-[10px]" style="background: ${surface}; border: 1px solid ${border}">
        <div class="text-zinc-500 text-[9px] font-mono">$ git push origin main</div>
        <div class="text-white text-[10px] pt-1">▲ Deployment live at edge</div>
        <div class="text-zinc-400 text-[8px] font-mono">commit: d7e8a9 (optimized-fonts)</div>
      </div>
      <div class="flex items-center justify-between pt-2 font-mono">
        <span class="text-[8px] text-zinc-500">IAD1 • Production</span>
        <div class="px-2.5 py-1 text-[10px] font-bold" style="background: #ffffff; color: #000000; border-radius: 6px;">
          Visit Preview
        </div>
      </div>
    `;
  } else if (id === "github") {
    mockupContent = `
      <div class="flex items-center justify-between text-[10px] pb-1.5 border-b" style="border-color: ${border}">
        <span class="font-mono text-[9px] opacity-70">PR #124 • main ← feat/api</span>
        <span class="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono" style="background: ${accent}25; color: #3fb950; border: 1px solid ${accent}60">✓ Passing</span>
      </div>
      <div class="pt-2">
        <h4 class="text-xs font-semibold leading-snug" style="color: ${text}">Implement rate limiter & RBAC</h4>
        <div class="flex items-center gap-2 pt-1 text-[10px] font-mono">
          <span class="text-emerald-400 font-bold">+184</span>
          <span class="text-rose-400 font-bold">-12</span>
          <span class="opacity-60 text-[9px]">across 6 files</span>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2.5 mt-0.5">
        <span class="text-[9px] opacity-70 font-mono">1 review approved</span>
        <div class="px-3 py-1 text-[10px] font-semibold" style="background: ${accent}; color: #ffffff; border-radius: 6px;">
          Merge Pull Request
        </div>
      </div>
    `;
  } else if (id === "supabase") {
    mockupContent = `
      <div class="flex items-center justify-between text-[10px] pb-1.5 border-b font-mono" style="border-color: ${border}">
        <span class="opacity-70 text-[9px]">postgres-prod • eu-central</span>
        <span class="px-1.5 py-0.2 rounded text-[9px] font-bold" style="background: ${accent}20; color: ${accent}; border: 1px solid ${accent}50">SQL Editor</span>
      </div>
      <div class="p-2 rounded mt-2 font-mono text-[10px] leading-relaxed" style="background: ${surface}; border: 1px solid ${border}">
        <span style="color: ${accent}">SELECT</span> id, email, role<br>
        <span style="color: ${accent}">FROM</span> auth.users <span style="color: ${accent}">LIMIT</span> 1;
      </div>
      <div class="flex items-center justify-between pt-2 font-mono">
        <span class="text-[9px] opacity-60">1 row (2.4ms)</span>
        <div class="px-3 py-1 text-[10px] font-bold" style="background: ${accent}; color: #171717; border-radius: 6px;">
          Run (⌘↵)
        </div>
      </div>
    `;
  } else if (id === "raycast") {
    mockupContent = `
      <div class="p-2 rounded-md flex items-center gap-2" style="background: ${surface}; border: 1px solid ${border}">
        <span style="color: ${accent}; font-size: 11px;">🔍</span>
        <span class="text-[10px] opacity-60 flex-1">Search actions, scripts...</span>
        <span class="px-1 py-0.5 rounded text-[8px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">⌘K</span>
      </div>
      <div class="p-2 rounded-md mt-2 flex items-center justify-between text-[10px]" style="background: #1a1a1e; border: 1px solid ${border}">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full" style="background: ${accent}"></span>
          <span style="color: ${text}" class="font-medium">Toggle Claude Agent</span>
        </div>
        <span class="text-[9px] font-mono opacity-50">Action</span>
      </div>
      <div class="flex items-center justify-between pt-2">
        <span class="text-[9px] opacity-60 font-mono">120+ extensions</span>
        <div class="px-3 py-1 text-[10px] font-medium" style="background: ${accent}; color: #ffffff; border-radius: 8px;">
          Execute (↵)
        </div>
      </div>
    `;
  } else if (id === "tailwind") {
    mockupContent = `
      <div class="flex items-center justify-between text-[10px] pb-1.5 border-b" style="border-color: ${border}">
        <span class="font-mono opacity-60 text-[9px]">Tailwind UI v4.0</span>
        <span class="px-1.5 py-0.2 rounded text-[9px] font-bold" style="background: ${accent}20; color: ${accent}">Utility</span>
      </div>
      <div class="p-2.5 rounded-lg mt-2" style="background: ${surface}; border: 1px solid ${border}">
        <div class="flex items-center gap-2">
          <span class="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold" style="background: ${accent}; color: #fff">flex</span>
          <span class="text-xs font-semibold tracking-tight" style="color: ${text}">Modern Dashboard</span>
        </div>
        <p class="text-[9px] opacity-60 pt-1 font-mono">bg-slate-900 shadow-xl border</p>
      </div>
      <div class="flex items-center justify-between pt-2">
        <span class="text-[9px] opacity-60 font-mono">scale: 4px</span>
        <div class="px-3 py-1 text-[10px] font-semibold shadow-xs" style="background: ${accent}; color: #ffffff; border-radius: 8px;">
          Build UI
        </div>
      </div>
    `;
  } else if (id === "notion") {
    mockupContent = `
      <div class="flex items-center justify-between text-[10px] pb-1 border-b" style="border-color: ${border}">
        <div class="flex items-center gap-1 opacity-70 text-[9px]">
          <span>📝</span>
          <span>Docs / Product Spec</span>
        </div>
        <span class="text-[9px] opacity-50">Public</span>
      </div>
      <div class="pt-2">
        <h4 class="text-xs font-semibold leading-snug" style="color: ${text}">Architecture RFC 2026</h4>
        <div class="space-y-1 pt-1.5 text-[10px] opacity-80">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-xs border border-zinc-400 flex items-center justify-center text-[8px] font-bold bg-white" style="color: #111">✓</span>
            <span class="text-[9px]">Single source of truth in DESIGN.md</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-xs border border-zinc-300 bg-white"></span>
            <span class="text-[9px]">Publish API documentation</span>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2.5 mt-0.5">
        <span class="text-[9px] opacity-50">Edited 2m ago</span>
        <div class="px-3 py-1 text-[10px] font-medium shadow-xs" style="background: #ffffff; color: ${text}; border: 1px solid ${border}; border-radius: 4px;">
          + New Page
        </div>
      </div>
    `;
  } else if (id === "figma") {
    mockupContent = `
      <div class="flex items-center justify-between text-[10px] pb-1.5 border-b" style="border-color: ${border}">
        <span class="text-[9px] font-mono opacity-60">Desktop / Frame 1440</span>
        <span class="px-1.5 py-0.2 rounded text-[8px] font-bold" style="background: ${accent}25; color: ${accent}; border: 1px solid ${accent}50">Selected</span>
      </div>
      <div class="p-2 rounded mt-2 text-[10px]" style="background: ${surface}; border: 1px solid ${border}">
        <div class="flex items-center justify-between text-[9px] font-mono opacity-70">
          <span>X: 120  Y: 80</span>
          <span style="color: ${accent}; font-weight: bold;">W: 1440  H: 900</span>
        </div>
        <div class="h-1.5 w-full bg-zinc-700/80 rounded-full mt-1.5 overflow-hidden">
          <div class="h-full rounded-full" style="width: 65%; background: ${accent}"></div>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2">
        <span class="text-[9px] opacity-60 font-mono">Corner: 12px</span>
        <div class="px-3 py-1 text-[10px] font-semibold" style="background: ${accent}; color: #ffffff; border-radius: 6px;">
          Export SVG
        </div>
      </div>
    `;
  } else if (id === "openai") {
    mockupContent = `
      <div class="flex items-center justify-between text-[10px] pb-1.5 border-b" style="border-color: ${border}">
        <span class="opacity-70 text-[9px]">GPT-4o • Code Reasoning</span>
        <span class="px-1.5 py-0.2 rounded text-[8px] font-bold" style="background: ${accent}20; color: ${accent}">● Active</span>
      </div>
      <div class="p-2 rounded-xl mt-2 text-[10px]" style="background: ${surface}; border: 1px solid ${border}">
        <div class="text-[9px] opacity-60">User: Build design tokens</div>
        <div class="flex items-start gap-1.5 pt-1.5">
          <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5" style="background: ${accent}; color: #ffffff">AI</span>
          <span class="text-[9px] leading-snug" style="color: ${text}">Configuring DESIGN.md with strict tokens.</span>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2">
        <span class="text-[9px] opacity-60 font-mono">Tokens: 148</span>
        <div class="px-3 py-1 text-[10px] font-semibold" style="background: ${accent}; color: #ffffff; border-radius: 12px;">
          Send (↵)
        </div>
      </div>
    `;
  } else if (id === "airbnb") {
    mockupContent = `
      <div class="flex items-center justify-between text-[10px] pb-1.5 border-b" style="border-color: ${border}">
        <span class="px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-white text-zinc-900 shadow-2xs border border-zinc-200">Guest favorite</span>
        <span class="text-[10px] font-semibold text-zinc-800">★ 4.98</span>
      </div>
      <div class="p-2.5 rounded-xl mt-2 shadow-2xs" style="background: ${surface}; border: 1px solid ${border}">
        <h4 class="text-xs font-semibold tracking-tight" style="color: ${text}">Modern Minimalist Loft</h4>
        <div class="flex items-baseline gap-1 pt-1">
          <span class="text-xs font-bold" style="color: ${text}">$195</span>
          <span class="text-[9px] opacity-60">/ night</span>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2">
        <span class="text-[9px] opacity-60 font-medium">Free cancellation</span>
        <div class="px-3 py-1 text-[10px] font-bold shadow-xs" style="background: ${accent}; color: #ffffff; border-radius: 12px; box-shadow: 0 2px 6px rgba(255,56,92,0.3)">
          Reserve
        </div>
      </div>
    `;
  }

  return `
    <div 
      class="theme-mockup-frame rounded-sm p-3 shadow-2xs select-none transition hover:shadow-md cursor-pointer group/mockup"
      style="background-color: ${canvas}; color: ${text}; border: 1px solid ${border}; ${fontCss}"
      title="Previzualizare UI live (${escapeHtml(theme.name)}) - Click pentru specificație Markdown"
    >
      ${mockupContent}
    </div>
  `;
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
    if (filter === "dark") {
      return cat.includes("dark") || ["linear", "vercel", "github", "supabase", "raycast", "tailwind", "figma", "openai"].includes(theme.id);
    }
    if (filter === "light") {
      return cat.includes("light") || ["apple", "stripe", "notion", "airbnb"].includes(theme.id);
    }
    if (filter === "dev") {
      return cat.includes("dev") || ["linear", "stripe", "vercel", "github", "supabase", "raycast", "tailwind"].includes(theme.id);
    }
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
