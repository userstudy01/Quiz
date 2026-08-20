// A one-shot "flash" message that survives a redirect: set it before navigating,
// and the next page shows it as a toast. Backed by sessionStorage so it also
// survives the hard reloads the auth layer sometimes triggers.
const KEY = 'flash';

export const setFlash = (type, message) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ type, message }));
  } catch {
    /* storage unavailable — skip the flash rather than crash */
  }
};

export const takeFlash = () => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
