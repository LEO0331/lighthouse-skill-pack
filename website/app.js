(function () {
  "use strict";

  const data = window.SKILLS_DATA || [];
  const skillList = document.getElementById("skill-list");
  const skillCount = document.getElementById("skill-count");
  const selectedSkill = document.getElementById("selected-skill");
  const contentEl = document.getElementById("skill-content");
  const copyBtn = document.getElementById("copy-btn");
  const downloadBtn = document.getElementById("download-btn");
  const searchInput = document.getElementById("skill-search");
  const statusEl = document.getElementById("status");

  let filtered = data.slice();
  let activeName = filtered[0] ? filtered[0].name : "";

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function getActiveItem() {
    return filtered.find((item) => item.name === activeName) || filtered[0] || null;
  }

  function setActiveByName(name) {
    activeName = name;
    const item = getActiveItem();

    if (!item) {
      selectedSkill.textContent = "No skill selected.";
      contentEl.textContent = "";
      setStatus("No matching skills for this filter.");
      return;
    }

    selectedSkill.textContent = item.name + " - " + item.description;
    contentEl.textContent = item.content;
    setStatus("");

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
      setActiveByName(item.name);
    });

    return btn;
  }

  function renderSkillCards() {
    skillList.replaceChildren();

    filtered.forEach((item) => {
      skillList.appendChild(createCard(item));
    });

    skillCount.textContent = String(filtered.length) + " skills";
    setActiveByName(activeName);
  }

  function applyFilter(query) {
    const needle = query.trim().toLowerCase();
    filtered = data.filter((item) => {
      if (!needle) return true;
      return (
        item.name.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle) ||
        item.content.toLowerCase().includes(needle)
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
      await navigator.clipboard.writeText(item.content);
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

  function downloadCurrentSkill() {
    const item = getActiveItem();
    if (!item) return;

    const blob = new Blob([item.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = item.name + ".md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("Downloaded " + item.name + ".md");
  }

  copyBtn.addEventListener("click", copyCurrentSkill);
  downloadBtn.addEventListener("click", downloadCurrentSkill);

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      applyFilter(searchInput.value);
    });
  }

  renderSkillCards();
})();
