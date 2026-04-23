(function () {
  "use strict";

  const skillList = document.getElementById("skill-list");
  const skillCount = document.getElementById("skill-count");
  const selectedSkill = document.getElementById("selected-skill");
  const contentEl = document.getElementById("skill-content");
  const copyBtn = document.getElementById("copy-btn");
  const downloadBtn = document.getElementById("download-btn");
  const searchInput = document.getElementById("skill-search");
  const statusEl = document.getElementById("status");

  let allSkills = [];
  let filtered = [];
  let activeName = "";
  const contentCache = new Map();

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function getActiveItem() {
    return filtered.find((item) => item.name === activeName) || filtered[0] || null;
  }

  async function loadSkillContent(item) {
    if (!item) return "";
    if (contentCache.has(item.path)) return contentCache.get(item.path);

    const response = await fetch("./" + item.path);
    if (!response.ok) {
      throw new Error("Failed to load " + item.path);
    }

    const content = await response.text();
    contentCache.set(item.path, content);
    return content;
  }

  async function setActiveByName(name) {
    activeName = name;
    const item = getActiveItem();

    if (!item) {
      selectedSkill.textContent = "No skill selected.";
      contentEl.textContent = "";
      setStatus("No matching skills for this filter.");
      return;
    }

    selectedSkill.textContent = item.name + " - " + item.description;
    setStatus("Loading " + item.name + "...");

    try {
      const content = await loadSkillContent(item);
      contentEl.textContent = content;
      setStatus("");
    } catch (_err) {
      contentEl.textContent = "";
      setStatus("Could not load skill markdown.");
    }

    const buttons = skillList.querySelectorAll(".skill-btn");
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-skill") === item.name);
    });
  }

  function createCard(item) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "skill-btn";
    btn.setAttribute("data-skill", item.name);

    const title = document.createElement("span");
    title.className = "title";
    title.textContent = item.name;

    const desc = document.createElement("span");
    desc.className = "desc";
    desc.textContent = item.description;

    btn.appendChild(title);
    btn.appendChild(desc);
    btn.addEventListener("click", function () {
      void setActiveByName(item.name);
    });

    return btn;
  }

  function renderSkillCards() {
    skillList.replaceChildren();

    filtered.forEach((item) => {
      skillList.appendChild(createCard(item));
    });

    skillCount.textContent = String(filtered.length) + " skills";
    void setActiveByName(activeName);
  }

  function applyFilter(query) {
    const needle = query.trim().toLowerCase();
    filtered = allSkills.filter((item) => {
      if (!needle) return true;
      return (
        item.name.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle)
      );
    });

    if (!filtered.some((item) => item.name === activeName)) {
      activeName = filtered[0] ? filtered[0].name : "";
    }

    renderSkillCards();
  }

  async function copyCurrentSkill() {
    const item = getActiveItem();
    if (!item) return;

    try {
      const content = await loadSkillContent(item);
      await navigator.clipboard.writeText(content);
      setStatus("Copied " + item.name + " to clipboard.");
      copyBtn.textContent = "Copied";
      setTimeout(function () {
        copyBtn.textContent = "Copy";
      }, 1200);
    } catch (_err) {
      setStatus("Clipboard write failed. Try manual copy.");
      copyBtn.textContent = "Copy failed";
      setTimeout(function () {
        copyBtn.textContent = "Copy";
      }, 1500);
    }
  }

  async function downloadCurrentSkill() {
    const item = getActiveItem();
    if (!item) return;

    try {
      const content = await loadSkillContent(item);
      const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = item.name + ".md";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus("Downloaded " + item.name + ".md");
    } catch (_err) {
      setStatus("Download failed.");
    }
  }

  async function init() {
    const response = await fetch("./skills-index.json");
    allSkills = await response.json();
    filtered = allSkills.slice();
    activeName = filtered[0] ? filtered[0].name : "";
    renderSkillCards();
  }

  copyBtn.addEventListener("click", function () {
    void copyCurrentSkill();
  });

  downloadBtn.addEventListener("click", function () {
    void downloadCurrentSkill();
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      applyFilter(searchInput.value);
    });
  }

  void init();
})();
