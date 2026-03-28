const BASE_URL = "http://localhost:3000/api/v1";

async function request(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!res.ok) throw new Error("Request failed");
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
