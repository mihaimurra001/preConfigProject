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
  fsBtnConfirmSelect: document.getElementById("fs-btn-confirm-select")
};

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
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
      document.getElementById(`tab-${tabId}`).classList.remove("hidden");
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
}
