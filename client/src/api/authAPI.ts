const BASE_URL = (import.meta as any).env?.VITE_API_URL || "/api/v1";

async function request(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || "Request failed");
  }
  return res.json();
}

export const createUser = async (
  username: string,
  email: string,
  password: string,
) =>
  request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

export const loginUser = async (email: string, password: string) =>
  request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

export const createGuest = async (guestName: string) =>
  request("/auth/guest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: guestName }),
  });

export const refreshToken = async (rToken: string) =>
  request("/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: rToken }),
  });
