/**
 * Fetches a URL with the Clerk session token as a Bearer header.
 * @param {string} url
 * @param {Function} getToken - Clerk's useAuth().getToken
 * @param {RequestInit} [options]
 */
export async function apiFetch(url, getToken, options = {}) {
  const token = await getToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}
