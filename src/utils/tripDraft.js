const DRAFT_KEY_PREFIX = "draft:";

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function getDraftStorageKey({ userId, tripId, scope }) {
  const uid = String(userId || "anon").trim() || "anon";
  const tid = String(tripId || "unknown").trim() || "unknown";
  const sc = String(scope || "default").trim() || "default";
  return `${DRAFT_KEY_PREFIX}${uid}:${tid}:${sc}`;
}

export function loadDraft({ userId, tripId, scope, fallback = null }) {
  const key = getDraftStorageKey({ userId, tripId, scope });
  const raw = localStorage.getItem(key);
  return safeJsonParse(raw, fallback);
}

export function saveDraft({ userId, tripId, scope, value }) {
  const key = getDraftStorageKey({ userId, tripId, scope });
  localStorage.setItem(key, JSON.stringify(value ?? null));
}

export function clearDraft({ userId, tripId, scope }) {
  const key = getDraftStorageKey({ userId, tripId, scope });
  localStorage.removeItem(key);
}
