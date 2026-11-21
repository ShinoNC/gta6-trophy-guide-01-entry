// guide.js — the detail pane: one trophy's guide, sources and notes.
import { displayName, displayDescription, spoilerHides } from "./filters.js";

function escapeHtml(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function guideHtml(text) {
  return escapeHtml(text).replace(/\[(\d)\]/g, "<sup>[$1]</sup>");
}

export function renderGuidePane(container, trophy, state, sources, callbacks) {
  if (!trophy) {
    container.innerHTML = "<h2>Pick a trophy</h2>"
      + "<p>Select any trophy in the list to read its <b>guide</b>, its <b>sources</b>, and your <b>notes</b> for it.</p>"
      + "<p><b>Start here:</b> open <b>Positive Mental Attitude</b> — the one possibly-missable trophy — then read the <b>Roadmap</b> tab before you play Chapter 1.</p>"
      + "<p>Every guide names where its facts come from. Four trophies have no confirmed method yet (as of 19/11/2026) — their guides say so plainly instead of inventing steps.</p>";
    return;
  }
  const hidden = spoilerHides(trophy, state);
  const earned = Boolean(state.earned[trophy.id]);
  const count = trophy.count ? (state.counts[trophy.id] || 0) : null;
  let html = "<h2>" + escapeHtml(displayName(trophy, state)) + "</h2>";
  html += '<div class="grade ' + trophy.grade + '">' + trophy.grade.toUpperCase() + " TROPHY</div>";
  html += '<p class="quote">“' + escapeHtml(displayDescription(trophy, state)) + "”</p>";
  if (trophy.missable) {
    html += '<div class="misscallout"><b>⚠ POSSIBLY MISSABLE — do in Chapter 1</b><p>' + escapeHtml(trophy.missableNote || "") + "</p></div>";
  }
  if (trophy.unconfirmed) {
    html += '<div class="misscallout" style="border-color:#6b6b18;background:#2c2c10"><b>UNCONFIRMED — no guide has confirmed the exact method yet (as of 19/11/2026)</b></div>';
  }
  if (trophy.hidden) html += '<p><span class="badge">HIDDEN ON PSN</span></p>';
  html += "<p><b>" + (earned ? "Earned ✓" : "Not earned yet") + "</b>";
  if (count !== null) html += " · Progress: " + count + " / " + trophy.count + " " + escapeHtml(trophy.countLabel || "");
  html += "</p>";
  if (count !== null) {
    html += '<div class="stepper"><button data-step="-1" aria-label="Decrease count">−</button><span>' + count + " / " + trophy.count + " " + escapeHtml(trophy.countLabel || "") + '</span><button data-step="1" aria-label="Increase count">+</button></div>';
  }
  html += "<h4>GUIDE</h4>";
  if (hidden) {
    html += "<p class=\"guide-text\">Hidden while spoiler-safe is on. Earn this story trophy (or switch spoiler-safe off) to read its guide.</p>";
  } else {
    html += '<p class="guide-text">' + guideHtml(trophy.guide) + "</p>";
  }
  html += "<h4>SOURCES · " + trophy.sources.length + " src</h4>";
  html += '<div class="srcs">';
  for (const srcId of trophy.sources) {
    const src = sources.find((s) => s.id === srcId);
    if (src) html += '<a href="' + escapeHtml(src.url) + '" target="_blank" rel="noopener">[' + src.id + "] " + escapeHtml(src.name) + " — " + escapeHtml(src.role) + "</a>";
  }
  html += "</div>";
  html += "<p style=\"font-size:12.5px;color:var(--faint)\">Official name, description &amp; grade: Exophase / PSNProfiles. Methods &amp; numbers: the guides named above, in this guide's own words.</p>";
  html += "<h4>YOUR NOTE</h4>";
  html += '<input class="noteinput" id="paneNote" type="text" placeholder="Note for this trophy…" value="' + escapeHtml(state.notes[trophy.id] || "") + '">';
  container.innerHTML = html;
  const noteInput = container.querySelector("#paneNote");
  if (noteInput) {
    noteInput.addEventListener("input", () => callbacks.onNote(trophy.id, noteInput.value));
  }
  for (const button of container.querySelectorAll("[data-step]")) {
    button.addEventListener("click", () => callbacks.onStep(trophy.id, Number(button.dataset.step)));
  }
}
