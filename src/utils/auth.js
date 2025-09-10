export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export function getCurrentUserId() {
  const token = getToken();
  if (!token) return null;
  const decoded = parseJwt(token);
  return decoded?.id ?? null;
}
