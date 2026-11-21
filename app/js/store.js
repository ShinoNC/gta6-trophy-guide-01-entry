// store.js — localStorage progress for the Vice Platinum tracker.
export const STORE_KEY = "vice-platinum-v2";

export function blankState() {
  return { earned: {}, counts: {}, notes: {}, spoiler: false, hideEarned: false };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    const state = blankState();
    if (parsed && typeof parsed === "object") {
      if (parsed.earned && typeof parsed.earned === "object") state.earned = parsed.earned;
      if (parsed.counts && typeof parsed.counts === "object") state.counts = parsed.counts;
      if (parsed.notes && typeof parsed.notes === "object") state.notes = parsed.notes;
      state.spoiler = parsed.spoiler === true;
      state.hideEarned = parsed.hideEarned === true;
    }
    return state;
  } catch (err) {
    return blankState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (err) {
    // Storage full or unavailable: progress stays in memory for this session.
  }
}

export function exportState(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "vice-platinum-progress.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function parseImport(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object") throw new Error("not an object");
  const state = blankState();
  if (parsed.earned && typeof parsed.earned === "object") state.earned = parsed.earned;
  if (parsed.counts && typeof parsed.counts === "object") state.counts = parsed.counts;
  if (parsed.notes && typeof parsed.notes === "object") state.notes = parsed.notes;
  state.spoiler = parsed.spoiler === true;
  state.hideEarned = parsed.hideEarned === true;
  return state;
}

export function resetState() {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch (err) {
    // Ignore: a fresh blank state is returned anyway.
  }
  return blankState();
}
