// Encode app data for URL
export function encodeAppData(app) {
  return btoa(JSON.stringify(app));
}

// Decode app data from URL
export function decodeAppData(encoded) {
  try {
    return JSON.parse(atob(encoded));
  } catch (e) {
    return null;
  }
}