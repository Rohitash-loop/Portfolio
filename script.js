const starterPreview = {
  name: "Your Name",
  role: "Your role / headline",
  email: "",
  location: "Your location",
  website: "",
  resume: "",
  github: "",
  linkedin: "",
  bio: "Your introduction will appear here after you fill in the editor.",
  availability: "Available for opportunities",
  photo: "",
  accent: "#c8f36a",
  compact: false,
  skills: [],
  projects: []
};

let data = JSON.parse(JSON.stringify(starterPreview));

const $ = id => document.getElementById(id);
const editor = $("editor");

function esc(s = "") {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function initials(name = "") {
  const value = name.trim();
  if (!value) return "YN";
  return value.split(/\s+/).filter(Boolean).slice(0,2).map(x => x[0]).join("").toUpperCase();
}

function renderEditor() {
  $("name").value = data.name === starterPreview.name ? "" : (data.name || "");
  $("role").value = data.role === starterPreview.role ? "" : (data.role || "");
  $("email").value = data.email || "";
  $("location").value = data.location === starterPreview.location ? "" : (data.location || "");
  $("website").value = data.website || "";
  $("resume").value = data.resume || "";
  $("github").value = data.github || "";
  $("linkedin").value = data.linkedin || "";
  $("bio").value = data.bio === starterPreview.bio ? "" : (data.bio || "");
  $("availability").value = data.availability === starterPreview.availability ? "" : (data.availability || "");
  $("accent").value = data.accent || starterPreview.accent;
  $("compact").checked = Boolean(data.compact);
  updateAccentLabel();
  updateBioCount();
  renderAvatarPreview();

  const skills = Array.isArray(data.skills) ? data.skills : [];
  $("skillsEditor").innerHTML = skills.map((s, i) => `
    <div class="dynamic-row">
      <input data-skill-name="${i}" value="${esc(s.name || "")}" placeholder="e.g. Web Design">
      <input data-skill-desc="${i}" value="${esc(s.desc || "")}" placeholder="Short description of this skill">
      <button type="button" class="remove-btn" onclick="removeSkill(${i})">Remove</button>
    </div>
  `).join("");

  const projects = Array.isArray(data.projects) ? data.projects : [];
  $("projectsEditor").innerHTML = projects.map((p, i) => `
    <div class="project-row">
      <input data-p-name="${i}" value="${esc(p.name || "")}" placeholder="e.g. Portfolio Website">
      <input data-p-type="${i}" value="${esc(p.type || "")}" placeholder="Category e.g. WEB">
      <textarea data-p-desc="${i}" rows="2" placeholder="What did you build and what problem did it solve?">${esc(p.desc || "")}</textarea>
      <input data-p-tags="${i}" value="${esc(p.tags || "")}" placeholder="Tags separated by commas">
      <input data-p-url="${i}" value="${esc(p.url || "")}" placeholder="Project URL (optional)">
      <button type="button" class="remove-btn" onclick="removeProject(${i})">Remove project</button>
    </div>
  `).join("");

  if (!skills.length) $("skillsEditor").innerHTML = `<div class="empty-editor">No skills yet. Click <strong>+ Add skill</strong> to start.</div>`;
  if (!projects.length) $("projectsEditor").innerHTML = `<div class="empty-editor">No projects yet. Click <strong>+ Add project</strong> to start.</div>`;
}

function renderAvatarPreview() {
  const preview = $("avatarPreview");
  const initialsEl = $("avatarInitials");
  if (data.photo) {
    preview.style.backgroundImage = `url("${data.photo}")`;
    preview.classList.add("has-photo");
    initialsEl.hidden = true;
  } else {
    preview.style.backgroundImage = "";
    preview.classList.remove("has-photo");
    initialsEl.hidden = false;
    initialsEl.textContent = initials(data.name);
  }
}

function renderPortfolio() {
  const name = data.name || "Your Name";
  const role = data.role || "Your role / headline";
  const bio = data.bio || starterPreview.bio;
  const location = data.location || "Your location";
  const availability = data.availability || starterPreview.availability;

  $("viewName").textContent = name;
  $("heroRole").textContent = role.toUpperCase();
  $("viewBio").textContent = bio;
  $("aboutCopy").textContent = bio;
  $("viewLocation").textContent = location;
  $("viewAvailability").textContent = availability;
  $("footerName").textContent = name;
  $("initials").textContent = initials(name);

  if (data.photo) {
    $("profileImage").src = data.photo;
    $("profileImage").hidden = false;
    $("initials").hidden = true;
  } else {
    $("profileImage").hidden = true;
    $("initials").hidden = false;
  }

  const accent = data.accent || starterPreview.accent;
  document.documentElement.style.setProperty("--accent", accent);
  document.documentElement.style.setProperty("--accent-dark", shadeColor(accent, -35));

  document.body.classList.toggle("compact", Boolean(data.compact));

  if (data.email) {
    $("emailBtn").href = `mailto:${data.email}`;
    $("contactEmail").href = `mailto:${data.email}`;
    $("contactEmail").textContent = `${data.email} ↗`;
  } else {
    $("emailBtn").href = "#contact";
    $("contactEmail").href = "#contact";
    $("contactEmail").textContent = "Add your email ↗";
  }

  setLink("resumeBtn", data.resume, "Resume ↗", true);
  setLink("contactWebsite", data.website, "Website ↗");
  setLink("contactGithub", data.github, "GitHub ↗");
  setLink("contactLinkedin", data.linkedin, "LinkedIn ↗");

  const skills = (data.skills || []).filter(s => s.name || s.desc);
  $("skillsView").innerHTML = skills.length ? skills.map((s,i) => `
    <article class="skill">
      <span class="skill-num">${String(i+1).padStart(2,"0")}</span>
      <h3>${esc(s.name || "Skill")}</h3>
      <p>${esc(s.desc || "")}</p>
    </article>
  `).join("") : `
    <article class="empty-card">
      <span class="skill-num">01</span>
      <h3>Your skills</h3>
      <p>Add your skills from the editor to show visitors what you can do.</p>
    </article>`;

  const projects = (data.projects || []).filter(p => p.name || p.desc);
  $("projectsView").innerHTML = projects.length ? projects.map((p,i) => `
    <article class="project">
      <div class="project-top"><span>${String(i+1).padStart(2,"0")}</span><span>${esc(p.type || "PROJECT")}</span></div>
      <h3>${esc(p.name || "Project")}</h3>
      <p>${esc(p.desc || "")}</p>
      <div class="project-tags">${String(p.tags || "").split(",").map(t => t.trim()).filter(Boolean).map(t => `<span>${esc(t)}</span>`).join("")}</div>
      ${p.url ? `<a class="project-link" href="${esc(p.url)}" target="_blank" rel="noreferrer">View project ↗</a>` : ""}
    </article>
  `).join("") : `
    <article class="empty-card">
      <span class="skill-num">01</span>
      <h3>Your first project</h3>
      <p>Add a project from the editor to showcase your work.</p>
    </article>`;
}

function setLink(id, url, label, showWhenEmpty = false) {
  const el = $(id);
  if (!el) return;
  if (url) {
    el.href = url;
    el.target = "_blank";
    el.rel = "noreferrer";
    el.style.display = id === "resumeBtn" ? "inline-flex" : "block";
  } else if (showWhenEmpty) {
    el.href = "#contact";
    el.removeAttribute("target");
    el.style.display = "inline-flex";
  } else {
    el.href = "#";
    el.removeAttribute("target");
    el.style.display = "none";
  }
  el.textContent = label;
}

function collect() {
  data.name = $("name").value.trim();
  data.role = $("role").value.trim();
  data.email = $("email").value.trim();
  data.location = $("location").value.trim();
  data.website = $("website").value.trim();
  data.resume = $("resume").value.trim();
  data.github = $("github").value.trim();
  data.linkedin = $("linkedin").value.trim();
  data.bio = $("bio").value.trim();
  data.availability = $("availability").value.trim();
  data.accent = $("accent").value;
  data.compact = $("compact").checked;

  data.skills = [...document.querySelectorAll("[data-skill-name]")].map((el,i) => ({
    name: el.value.trim(),
    desc: document.querySelector(`[data-skill-desc="${i}"]`).value.trim()
  })).filter(x => x.name || x.desc);

  data.projects = [...document.querySelectorAll("[data-p-name]")].map((el,i) => ({
    name: el.value.trim(),
    type: document.querySelector(`[data-p-type="${i}"]`).value.trim(),
    desc: document.querySelector(`[data-p-desc="${i}"]`).value.trim(),
    tags: document.querySelector(`[data-p-tags="${i}"]`).value.trim(),
    url: document.querySelector(`[data-p-url="${i}"]`).value.trim()
  })).filter(x => x.name || x.desc || x.tags || x.url);
}

function saveData(showToast = true) {
  collect();
  renderPortfolio();
  if (showToast) toast("Portfolio updated");
}

function openEditor() {
  editor.classList.remove("hidden");
  renderEditor();
  document.body.classList.add("modal-open");
  setTimeout(() => $("name").focus(), 50);
}

function closeEditor() {
  editor.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function updateBioCount() {
  $("bioCount").textContent = `${$("bio").value.length} / 500`;
}

function updateAccentLabel() {
  $("accentValue").textContent = $("accent").value.toUpperCase();
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

function shadeColor(hex, amount) {
  const num = parseInt(hex.replace("#",""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return `rgb(${r}, ${g}, ${b})`;
}

window.removeSkill = i => {
  collect();
  data.skills.splice(i,1);
  renderEditor();
};

window.removeProject = i => {
  collect();
  data.projects.splice(i,1);
  renderEditor();
};

$("portfolioForm").addEventListener("submit", e => {
  e.preventDefault();
  saveData();
  closeEditor();
});

$("addSkill").addEventListener("click", () => {
  collect();
  data.skills.push({name:"", desc:""});
  renderEditor();
  const inputs = document.querySelectorAll("[data-skill-name]");
  inputs[inputs.length - 1]?.focus();
});

$("addProject").addEventListener("click", () => {
  collect();
  data.projects.push({name:"", type:"", desc:"", tags:"", url:""});
  renderEditor();
  const inputs = document.querySelectorAll("[data-p-name]");
  inputs[inputs.length - 1]?.focus();
});

$("editBtn").addEventListener("click", openEditor);
$("closeEditor").addEventListener("click", closeEditor);
$("previewBtn").addEventListener("click", () => {
  saveData(false);
  closeEditor();
  window.scrollTo({top:0, behavior:"smooth"});
  toast("Preview updated");
});

$("printBtn").addEventListener("click", () => {
  if (!editor.classList.contains("hidden")) {
    saveData(false);
    closeEditor();
  }
  window.print();
});

$("resetBtn").addEventListener("click", () => {
  if (confirm("Reset this portfolio to a blank starter template? Your saved details will be cleared.")) {
    data = JSON.parse(JSON.stringify(starterPreview));
    renderEditor();
    renderPortfolio();
    toast("Portfolio reset");
  }
});

$("photo").addEventListener("change", e => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    toast("Please choose an image under 2 MB");
    e.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    data.photo = reader.result;
    renderAvatarPreview();
  };
  reader.readAsDataURL(file);
});

$("removePhoto").addEventListener("click", () => {
  data.photo = "";
  $("photo").value = "";
  renderAvatarPreview();
});

$("bio").addEventListener("input", updateBioCount);
$("accent").addEventListener("input", updateAccentLabel);
$("compact").addEventListener("change", () => {
  document.body.classList.toggle("compact", $("compact").checked);
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !editor.classList.contains("hidden")) closeEditor();
});

renderPortfolio();
openEditor();
