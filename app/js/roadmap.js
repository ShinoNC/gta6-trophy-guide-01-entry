// roadmap.js — the 3-stage roadmap to the platinum and the 100% checklist.
// Every step carries a numbered citation: [1] Exophase, [2] PSNProfiles,
// [3] KeenGamer, [4] OutputLag. Count markers with countRoadmapMarkers().

export const ROADMAP = [
  {
    stage: 1,
    title: "Stage 1 — Story + side activities",
    hours: "60–80 hours",
    intro: "Play the 5 chapters in order. Do the activities as they unlock, and start the long scans early — WAiNK-scanning vehicles and studying animals from the start, because 100% needs 200 of 277 base-model vehicles. [3]",
    bullets: [
      "Do Lucia's balcony meditation in Chapter 1, after the mission Down to Earth. It is the one possibly-missable step in the whole game (see Missables). [3][4]",
      "Manual save at the START and END of every chapter — the save box below has the full rules. [3][4]",
      "Try each of the 9 activity types once as they unlock (Master of None). [3]",
      "In Chapter 3, do Race Against Yago the moment it appears — it is time-sensitive (hourglass icon) and its strand counts toward Strangers & Freaks. [3]",
      "Chapter 3 gives you the Snap Gun (Yasmani's Jewelry Jobs) for jewelry robberies; near the end of Chapter 4, That's Where The Money Is… opens bank vaults. [3]",
      "Never use cheats on your trophy save — cheats disable trophies and saving. [3][4]",
    ],
  },
  {
    stage: 2,
    title: "Stage 2 — 100% completion",
    hours: "~100 hours",
    intro: "After the story, open Progress, then Stats, then 100% Completion and work the checklist below. Everything here is still available in free roam. [3]",
    bullets: [
      "Robberies: 39 Gang Operations, 22 Bank Jobs, 7 Payday Loan Jobs, 8 bank vaults. [3]",
      "Collectibles: 15 card sets, 100 WAiNK locations, 33 underwater discoveries, 100 of 125 Cocaine Flamingos, 5 of 7 Kenton's Treasure Sets, 30 of 34 magazines / books / comics. [3]",
      "Activities: 42 of 42 Shooting Range golds, 42 of 42 Drone Time Trials, 300 stunts, 70 of 80 challenges, 15 of 15 Bret's Target Decks, 30 of 40 races won, 10 of 13 Race Challenge golds. [3]",
      "Scanning: 200 of 277 base-model vehicles, 100 animals studied with binoculars. [3]",
      "This stage earns A Long Road (gold) and most of the silver trophies. [1][3]",
    ],
  },
  {
    stage: 3,
    title: "Stage 3 — Strangers & remaining cleanup",
    hours: "10–20 hours",
    intro: "Finish the side-story finales and whatever the 100% checklist left behind. [3]",
    bullets: [
      "Final missions for Andy, Kenton, Billy, Randy and Tyrone (5 trophies). [3]",
      "The 8 stranger strands for Strangers & Freaks — Andy's, Billy's and Tyrone's strands do not count toward it. [3]",
      "Leftover misc trophies: the four unconfirmed ones (check their guides), money trophies, and the platinum itself. [1][3]",
    ],
  },
];

export const CHECKLIST = [
  {
    group: "Story",
    note: "Complete the story first; every row below is a trophy or a chapter step. [1][3]",
    rows: [
      ["Complete all 5 chapters", 5, 5],
      ["Complete the final mission", 1, 1],
    ],
  },
  {
    group: "Robberies",
    note: "Gang Operations, Bank Jobs and Payday Loan Jobs plus the 8 bank vaults. [3]",
    rows: [
      ["Gang Operations robbed", 39, 39],
      ["Bank Jobs robbed", 22, 22],
      ["Payday Loan Jobs robbed", 7, 7],
      ["Bank vaults robbed", 8, 8],
    ],
  },
  {
    group: "Collectibles",
    note: "Cards, WAiNK, underwater finds, flamingos, treasure sets and reading matter. [3]",
    rows: [
      ["Collectible Card sets", 15, 18],
      ["WAiNK locations", 100, 100],
      ["Underwater discoveries", 33, 33],
      ["Cocaine Flamingos", 100, 125],
      ["Kenton's Treasure Sets", 5, 7],
      ["Magazines / books / comics", 30, 34],
    ],
  },
  {
    group: "Activities",
    note: "Shooting Range, drones, stunts, challenges, Bret's decks and races. [3]",
    rows: [
      ["Shooting Range gold medals", 42, 42],
      ["Drone Time Trials", 42, 42],
      ["Stunts", 300, 397],
      ["Challenges", 70, 80],
      ["Bret's Target Decks", 15, 15],
      ["Races won", 30, 40],
      ["Race Challenge golds", 10, 13],
    ],
  },
  {
    group: "Scanning",
    note: "Vehicles and animals, studied from the start of the game. [3]",
    rows: [
      ["Base-model vehicles discovered", 200, 277],
      ["Animals studied with binoculars", 100, 100],
    ],
  },
  {
    group: "Strangers & side stories",
    note: "Eight stranger strands plus the five side-story finales. [3]",
    rows: [
      ["Stranger mission strands", 8, 8],
      ["Side-story finales (Andy, Kenton, Billy, Randy, Tyrone)", 5, 5],
    ],
  },
];

export const SAVE_RULES = "GTA VI has no mission replay and no New Game Plus. The game has 15 manual save slots plus one autosave: keep one save at the start of each chapter and an untouched one from just before the final mission, and rotate the rest. Cheats disable trophies and saving. [3][4]";

export function countRoadmapMarkers() {
  const text = ROADMAP.map((s) => [s.intro, ...s.bullets].join(" ")).join(" ")
    + " " + CHECKLIST.map((g) => g.note).join(" ")
    + " " + SAVE_RULES;
  const hits = text.match(/\[\d\]/g);
  return hits ? hits.length : 0;
}

export function countRoadmapMarkersBySource() {
  const text = ROADMAP.map((s) => [s.intro, ...s.bullets].join(" ")).join(" ")
    + " " + CHECKLIST.map((g) => g.note).join(" ")
    + " " + SAVE_RULES;
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const hit of text.match(/\[(\d)\]/g) || []) {
    const n = Number(hit[1]);
    if (counts[n] !== undefined) counts[n] += 1;
  }
  return counts;
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function citeHtml(text) {
  return escapeHtml(text).replace(/\[(\d)\]/g, "<sup>[$1]</sup>");
}

export function renderChecklistHtml() {
  let html = "";
  for (const group of CHECKLIST) {
    html += '<div class="checkgroup">' + escapeHtml(group.group) + "</div>";
    html += "<p>" + citeHtml(group.note) + "</p>";
    html += '<table class="check"><thead><tr><th>Requirement</th><th class="num">Need</th><th class="num">Of</th></tr></thead><tbody>';
    for (const row of group.rows) {
      html += "<tr><td>" + escapeHtml(row[0]) + '</td><td class="num">' + row[1] + '</td><td class="num">' + row[2] + "</td></tr>";
    }
    html += "</tbody></table>";
  }
  return html;
}

export function renderRoadmap(container, trophies, state) {
  let html = "<h2>Roadmap to the platinum</h2>";
  html += "<p>Platinum: <b>~200 hours</b>, difficulty <b>4/10</b>, <b>1 playthrough</b>, <b>0 online trophies</b>, no difficulty trophies, no mission medals. It is long, not hard. Sources: KeenGamer, OutputLag. [3][4]</p>";
  html += '<div class="savebox"><b>Save strategy — read this first.</b> ' + citeHtml(SAVE_RULES) + "</div>";
  for (const stage of ROADMAP) {
    const stageTrophies = trophies.filter((t) => t.stage === stage.stage);
    const earned = stageTrophies.filter((t) => state.earned[t.id]).length;
    const pct = stageTrophies.length ? Math.round((earned / stageTrophies.length) * 100) : 0;
    html += '<div class="stagecard"><h3>' + escapeHtml(stage.title) + "</h3>";
    html += '<div class="hours">' + escapeHtml(stage.hours) + " · " + earned + "/" + stageTrophies.length + " trophies earned</div>";
    html += '<div class="progressline"><i style="width:' + pct + '%"></i></div>';
    html += "<p>" + citeHtml(stage.intro) + "</p><ul>";
    for (const bullet of stage.bullets) html += "<li>" + citeHtml(bullet) + "</li>";
    html += "</ul></div>";
  }
  container.innerHTML = html;
}

export function renderMissables(container, trophies) {
  const missable = trophies.find((t) => t.missable);
  let html = "<h2>Missables — only one trophy can be missed</h2>";
  if (missable) {
    html += '<div class="misscallout"><b>⚠ ' + escapeHtml(missable.name) + " — POSSIBLY MISSABLE</b><p>"
      + citeHtml(missable.guide) + "</p><p><b>Sources differ?</b> No: KeenGamer and OutputLag agree the Chapter 1 balcony meditation disappears after Chapter 1. [3][4] This guide still hedges it as possibly missable, because the game is new and the window is reported, not proven in every build. [3][4]</p></div>";
  }
  html += '<div class="savebox"><b>Save rules that protect you.</b> ' + citeHtml(SAVE_RULES) + "</div>";
  html += "<h3>Everything else is safe after the story</h3>";
  html += "<p>Every other trophy can be earned in free roam after the credits — story trophies pop as you play, side-story finales stay open, and the whole 100% checklist stays available. The four trophies with no confirmed method yet (Bad Luck, I Guess; The Truth Is Out There; In The Beginning…; Capital Offense) are marked UNCONFIRMED in their guides — they may pop while you play normally. [1][3]</p>";
  html += "<h2>A Long Road — the 100% checklist</h2>";
  html += "<p>Gold trophy <b>A Long Road</b> needs every row below. The checklist itself only appears in-game after the story (Progress, then Stats, then 100% Completion), but work done earlier counts. Numbers: KeenGamer, OutputLag. [3][4]</p>";
  html += renderChecklistHtml();
  container.innerHTML = html;
}

export function renderChecklist(container) {
  let html = "<h2>A Long Road — the 100% checklist</h2>";
  html += "<p>Gold trophy <b>A Long Road</b> needs every row below. The checklist itself only appears in-game after the story (Progress, then Stats, then 100% Completion), but work done earlier counts. Numbers: KeenGamer. [3]</p>";
  html += renderChecklistHtml();
  container.innerHTML = html;
}
