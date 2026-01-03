const WISHLIST_KEY_PREFIX = 'wishlist:';

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function getWishlistStorageKey(userId) {
  const id = String(userId || 'anon').trim() || 'anon';
  return `${WISHLIST_KEY_PREFIX}${id}`;
}

export function loadWishlistMap(userId) {
  const key = getWishlistStorageKey(userId);
  const raw = localStorage.getItem(key);
  const parsed = safeJsonParse(raw, null);
  if (!parsed || typeof parsed !== 'object') return {};
  return parsed;
}

export function saveWishlistMap(userId, map) {
  const key = getWishlistStorageKey(userId);
  localStorage.setItem(key, JSON.stringify(map || {}));
}

export function listWishlistItems(userId) {
  const map = loadWishlistMap(userId);
  return Object.values(map || {});
}

export function isWishlisted(userId, tripId) {
  const map = loadWishlistMap(userId);
  return Boolean(map && tripId && map[tripId]);
}

export function toggleWishlistItem(userId, trip) {
  if (!trip?.id) return { isWishlisted: false, map: loadWishlistMap(userId) };

  const map = loadWishlistMap(userId);
  const id = String(trip.id);

  if (map[id]) {
    delete map[id];
    saveWishlistMap(userId, map);
    return { isWishlisted: false, map };
  }

  const inferredType = trip?.type || (trip?.name && !trip?.title ? "activity" : "trip");

  // Store a small snapshot; enough to render a list.
  map[id] = {
    id: id,
    type: inferredType,
    title: trip?.title || trip?.name || 'Trip',
    description: trip?.description || '',
    image: trip?.image || null,
    imageAlt: trip?.imageAlt || trip?.title || 'Trip image',
    cities: trip?.cities ?? null,
    duration: trip?.duration ?? null,
    budget: trip?.budget ?? trip?.estimatedCost ?? null,
    travelStyle: trip?.travelStyle ?? null,
    category: trip?.category ?? null,
    priceRange: trip?.priceRange ?? null,
    savedAt: new Date().toISOString(),
  };

  saveWishlistMap(userId, map);
  return { isWishlisted: true, map };
}
