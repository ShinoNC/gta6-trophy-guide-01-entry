// filters.js — kind list, search, grade filter and the spoiler rule.
export const KIND_ORDER = ["story", "missable", "collectibles", "activities", "combat", "exploration", "money", "misc"];

export const KIND_LABELS = {
  story: "Story",
  missable: "Missable",
  collectibles: "Collectibles",
  activities: "Activities",
  combat: "Combat / Robbery",
  exploration: "Exploration",
  money: "Money",
  misc: "Misc / Hidden",
};

export function kindLabel(kind) {
  return KIND_LABELS[kind] || kind;
}

export function isStoryTrophy(trophy) {
  return trophy.kinds.includes("story");
}

export function spoilerHides(trophy, state) {
  return state.spoiler && isStoryTrophy(trophy) && !state.earned[trophy.id];
}

export function displayName(trophy, state) {
  if (spoilerHides(trophy, state)) return "??? · Story trophy #" + trophy.id;
  return trophy.name;
}

export function displayDescription(trophy, state) {
  if (spoilerHides(trophy, state)) return "Hidden while spoiler-safe is on. Earn it (or switch spoiler-safe off) to reveal it.";
  return trophy.description;
}

export function matchesSearch(trophy, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [trophy.name, trophy.description, trophy.guide, trophy.kinds.join(" "), trophy.grade].join(" ").toLowerCase();
  return hay.includes(q);
}

export function filterTrophies(trophies, state, opts) {
  const query = opts.query || "";
  const kind = opts.kind || "";
  const grade = opts.grade || "";
  return trophies.filter((trophy) => {
    if (kind && !trophy.kinds.includes(kind)) return false;
    if (grade && trophy.grade !== grade) return false;
    if (state.hideEarned && state.earned[trophy.id]) return false;
    if (!matchesSearch(trophy, query)) return false;
    return true;
  });
}

export function countByKind(trophies) {
  const counts = {};
  for (const kind of KIND_ORDER) counts[kind] = 0;
  for (const trophy of trophies) {
    for (const kind of trophy.kinds) {
      if (counts[kind] === undefined) counts[kind] = 0;
      counts[kind] += 1;
    }
  }
  return counts;
}
