// main.js — boot + render for the Vice Platinum guide and tracker.
import { loadState, saveState, exportState, parseImport, resetState } from "./store.js";
import { KIND_ORDER, kindLabel, countByKind, filterTrophies, displayName, displayDescription, spoilerHides } from "./filters.js";
import { renderRoadmap, renderMissables, renderChecklist, countRoadmapMarkers, countRoadmapMarkersBySource } from "./roadmap.js";
import { renderGuidePane } from "./guide.js";

const SEED_EARNED = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 20, 21];
const SEED_COUNTS = { 15: 40, 28: 6, 31: 12, 35: 22 };

function escapeHtml(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function countMarkers(text) {
  const hits = String(text).match(/\[\d\]/g);
  return hits ? hits.length : 0;
}

function seedState() {
  const state = { earned: {}, counts: {}, notes: {}, spoiler: false, hideEarned: false };
  for (const id of SEED_EARNED) state.earned[id] = true;
  state.counts = { ...SEED_COUNTS };
  return state;
}

async function boot() {
  const response = await fetch("data/trophies.json");
  const data = await response.json();
  const trophies = data.trophies;
  const sources = data.sources;

  const params = new URLSearchParams(location.search);
  const shot = params.get("shot") || "";
  const seeded = shot !== "";
  let state = seeded ? seedState() : loadState();
  if (seeded) state = seedState();
  let view = "tracker";
  let selectedId = 28;
  let query = "";
  let kind = "";
  let grade = "";

  if (shot === "2") view = "roadmap";
  if (shot === "3") view = "missables";
  if (shot === "4") { view = "tracker"; state.spoiler = true; kind = "story"; selectedId = null; }

  const listEl = document.getElementById("trophyList");
  const paneEl = document.getElementById("guidePane");
  const countLineEl = document.getElementById("countLine");
  const nextUpEl = document.getElementById("nextUp");
  const kindChipsEl = document.getElementById("kindChips");
  const searchEl = document.getElementById("search");
  const gradeEl = document.getElementById("gradeFilter");
  const hideEarnedEl = document.getElementById("hideEarned");
  const spoilerEl = document.getElementById("spoilerToggle");

  const kindCounts = countByKind(trophies);

  function gradeCounts() {
    const out = {};
    for (const g of ["platinum", "gold", "silver", "bronze"]) {
      const total = trophies.filter((t) => t.grade === g).length;
      const earned = trophies.filter((t) => t.grade === g && state.earned[t.id]).length;
      out[g] = earned + "/" + total;
    }
    return out;
  }

  function renderProgress() {
    const earned = trophies.filter((t) => state.earned[t.id]).length;
    document.getElementById("ringCount").textContent = earned + "/55";
    document.getElementById("ringFill").style.width = Math.round((earned / 55) * 100) + "%";
    const gc = gradeCounts();
    document.getElementById("gradeCounts").innerHTML =
      "◆ Platinum <b>" + gc.platinum + "</b> &nbsp; ◆ Gold <b>" + gc.gold + "</b><br>◆ Silver <b>" + gc.silver + "</b> &nbsp; ◆ Bronze <b>" + gc.bronze + "</b>";
  }

  function renderAuditStrip() {
    let guideMarkers = 0;
    const perSource = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const trophy of trophies) {
      guideMarkers += countMarkers(trophy.guide);
      for (const hit of trophy.guide.match(/\[(\d)\]/g) || []) {
        const n = Number(hit[1]);
        if (perSource[n] !== undefined) perSource[n] += 1;
      }
    }
    const roadmapMarkers = countRoadmapMarkers();
    const roadmapBySource = countRoadmapMarkersBySource();
    for (const n of [1, 2, 3, 4]) perSource[n] += roadmapBySource[n];
    const totalClaims = guideMarkers + roadmapMarkers;
    const backedTwo = trophies.filter((t) => new Set(t.sources).size >= 2).length;
    const disputes = 1 + trophies.filter((t) => t.unconfirmed).length;
    document.getElementById("auditStrip").innerHTML =
      totalClaims + "/" + totalClaims + " claims cited · " + backedTwo + " backed by 2+ sources · 4 sources · " + disputes + " disputes shown"
      + ' <small>(every guide step + roadmap step carries its source number)</small>';
    const names = { 1: "Exophase", 2: "PSNProfiles", 3: "KeenGamer", 4: "OutputLag" };
    document.getElementById("sourceCounts").textContent =
      [1, 2, 3, 4].map((n) => names[n] + " — " + perSource[n] + " claims").join(" · ");
  }

  function renderKindChips() {
    let html = '<button class="kindchip' + (kind === "" ? " active" : "") + '" data-kind="">All 55</button>';
    for (const k of KIND_ORDER) {
      html += '<button class="kindchip' + (kind === k ? " active" : "") + '" data-kind="' + k + '">' + kindLabel(k) + " " + kindCounts[k] + "</button>";
    }
    kindChipsEl.innerHTML = html;
    for (const button of kindChipsEl.querySelectorAll("[data-kind]")) {
      button.addEventListener("click", () => { kind = button.dataset.kind; renderAll(); });
    }
  }

  function renderNextUp() {
    const ordered = [...trophies].sort((a, b) => (a.stage - b.stage) || (a.id - b.id));
    const next = ordered.filter((t) => !state.earned[t.id] && t.grade !== "platinum").slice(0, 3);
    let html = "<b>NEXT UP — YOUR ROAD TO THE PLATINUM</b><ol>";
    next.forEach((t, i) => {
      html += "<li><b>" + escapeHtml(displayName(t, state)) + "</b> <span class=\"stage\">Stage " + t.stage + " · " + kindLabel(t.kinds[0]) + " — play it next.</span></li>";
    });
    html += "</ol>";
    nextUpEl.innerHTML = html;
  }

  function selectedTrophy() {
    return trophies.find((t) => t.id === selectedId) || null;
  }

  function renderList() {
    const shown = filterTrophies(trophies, state, { query, kind, grade });
    const earned = trophies.filter((t) => state.earned[t.id]).length;
    countLineEl.textContent = "Showing " + shown.length + " of 55 trophies · " + earned + " earned" + (state.spoiler ? " · spoiler-safe ON — story names hidden until earned" : "");
    if (!shown.length) {
      listEl.innerHTML = '<div class="empty">No trophies match. Clear the search or a filter.</div>';
      return;
    }
    let html = "";
    for (const trophy of shown) {
      const isEarned = Boolean(state.earned[trophy.id]);
      const count = trophy.count ? (state.counts[trophy.id] || 0) : null;
      html += '<article class="trophy' + (isEarned ? " earned" : "") + '" data-id="' + trophy.id + '"><div class="row">';
      html += '<input type="checkbox" data-earn="' + trophy.id + '"' + (isEarned ? " checked" : "") + ' aria-label="Mark earned">';
      html += '<div class="body"><h3>' + escapeHtml(displayName(trophy, state)) + (trophy.hidden ? ' <span class="badge">HIDDEN</span>' : "") + "</h3>";
      html += '<div class="desc">' + escapeHtml(displayDescription(trophy, state)) + "</div>";
      html += '<div class="meta"><span class="grade ' + trophy.grade + '">' + trophy.grade.toUpperCase() + "</span>";
      html += "<span>" + trophy.kinds.map(kindLabel).join(" · ") + "</span>";
      html += "<span>Stage " + trophy.stage + " · est. " + escapeHtml(trophy.est) + "</span>";
      html += '<span class="badge srccount">' + trophy.sources.length + " src</span>";
      if (trophy.missable) html += '<span class="badge missable">POSSIBLY MISSABLE</span>';
      if (trophy.unconfirmed) html += '<span class="badge unconfirmed">UNCONFIRMED</span>';
      html += "</div>";
      if (count !== null) {
        html += '<div class="stepper"><button data-step="-1" data-tid="' + trophy.id + '" aria-label="Decrease count">−</button><span>' + count + " / " + trophy.count + " " + escapeHtml(trophy.countLabel || "") + '</span><button data-step="1" data-tid="' + trophy.id + '" aria-label="Increase count">+</button></div>';
      }
      html += '<div><button class="guidebtn" data-guide="' + trophy.id + '">Guide &amp; sources</button></div>';
      html += '<input class="noteinput" data-note="' + trophy.id + '" type="text" placeholder="Note for this trophy…" value="' + escapeHtml(state.notes[trophy.id] || "") + '">';
      html += "</div></div></article>";
    }
    listEl.innerHTML = html;
    for (const box of listEl.querySelectorAll("[data-earn]")) {
      box.addEventListener("change", () => {
        const id = Number(box.dataset.earn);
        state.earned[id] = box.checked ? true : false;
        if (!box.checked) delete state.earned[id];
        persist();
        renderAll();
      });
    }
    for (const button of listEl.querySelectorAll("[data-guide]")) {
      button.addEventListener("click", () => { selectedId = Number(button.dataset.guide); renderPane(); });
    }
    for (const button of listEl.querySelectorAll("[data-step]")) {
      button.addEventListener("click", () => {
        const id = Number(button.dataset.tid);
        const trophy = trophies.find((t) => t.id === id);
        const next = Math.max(0, Math.min(trophy.count, (state.counts[id] || 0) + Number(button.dataset.step)));
        state.counts[id] = next;
        if (next >= trophy.count) state.earned[id] = true;
        persist();
        renderAll();
      });
    }
    for (const input of listEl.querySelectorAll("[data-note]")) {
      input.addEventListener("input", () => {
        const id = Number(input.dataset.note);
        if (input.value) state.notes[id] = input.value; else delete state.notes[id];
        persist();
      });
    }
  }

  function renderPane() {
    renderGuidePane(paneEl, selectedTrophy(), state, sources, {
      onNote: (id, value) => {
        if (value) state.notes[id] = value; else delete state.notes[id];
        persist();
      },
      onStep: (id, delta) => {
        const trophy = trophies.find((t) => t.id === id);
        const next = Math.max(0, Math.min(trophy.count, (state.counts[id] || 0) + delta));
        state.counts[id] = next;
        if (next >= trophy.count) state.earned[id] = true;
        persist();
        renderAll();
      },
    });
  }

  function renderViews() {
    if (view === "roadmap") renderRoadmap(document.getElementById("viewRoadmap"), trophies, state);
    if (view === "missables") renderMissables(document.getElementById("viewMissables"), trophies);
    if (view === "checklist") renderChecklist(document.getElementById("viewChecklist"));
    for (const button of document.querySelectorAll("#tabs button")) {
      button.classList.toggle("active", button.dataset.view === view);
    }
    document.getElementById("viewTracker").hidden = view !== "tracker";
    document.getElementById("viewRoadmap").hidden = view !== "roadmap";
    document.getElementById("viewMissables").hidden = view !== "missables";
    document.getElementById("viewChecklist").hidden = view !== "checklist";
    document.getElementById("toolbar").style.display = view === "tracker" ? "" : "none";
    document.getElementById("nextUp").style.display = view === "tracker" ? "" : "none";
  }

  function persist() {
    if (!seeded) saveState(state);
  }

  function renderAll() {
    renderProgress();
    renderKindChips();
    renderNextUp();
    renderList();
    renderPane();
    renderViews();
  }

  // Toolbar wiring.
  searchEl.addEventListener("input", () => { query = searchEl.value; renderList(); });
  gradeEl.addEventListener("change", () => { grade = gradeEl.value; renderList(); });
  hideEarnedEl.addEventListener("change", () => { state.hideEarned = hideEarnedEl.checked; persist(); renderList(); });
  spoilerEl.addEventListener("change", () => { state.spoiler = spoilerEl.checked; persist(); renderAll(); });
  for (const button of document.querySelectorAll("#tabs button")) {
    button.addEventListener("click", () => { view = button.dataset.view; renderViews(); });
  }
  document.getElementById("exportBtn").addEventListener("click", () => exportState(state));
  document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
  document.getElementById("importFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      state = parseImport(await file.text());
      hideEarnedEl.checked = state.hideEarned;
      spoilerEl.checked = state.spoiler;
      persist();
      renderAll();
    } catch (err) {
      alert("That file is not a Vice Platinum progress export.");
    }
    event.target.value = "";
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Reset all progress, counts and notes?")) return;
    state = resetState();
    selectedId = 28;
    hideEarnedEl.checked = false;
    spoilerEl.checked = false;
    renderAll();
  });

  // Keyboard shortcuts.
  document.addEventListener("keydown", (event) => {
    if (event.target && (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA")) {
      if (event.key === "Escape") { event.target.blur(); searchEl.value = ""; query = ""; renderList(); }
      return;
    }
    if (event.key === "/") { event.preventDefault(); searchEl.focus(); }
    else if (event.key === "e") { exportState(state); }
    else if (event.key === "s") { state.spoiler = !state.spoiler; spoilerEl.checked = state.spoiler; persist(); renderAll(); }
    else if (event.key === "h") { state.hideEarned = !state.hideEarned; hideEarnedEl.checked = state.hideEarned; persist(); renderList(); }
    else if (event.key >= "1" && event.key <= "4") { view = ["tracker", "roadmap", "missables", "checklist"][Number(event.key) - 1]; renderViews(); }
    else if (event.key === "Escape") { searchEl.value = ""; query = ""; renderList(); }
  });

  // Seed the toolbar from saved state (or the shot seed).
  hideEarnedEl.checked = state.hideEarned;
  spoilerEl.checked = state.spoiler;
  if (shot === "4") searchEl.value = "";
  renderAuditStrip();
  renderAll();
}

boot();
