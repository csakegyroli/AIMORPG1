export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

export async function apiJson<T = unknown>(path: string, init: RequestInit = {}): Promise<{ ok: boolean; status: number; data: T }> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  let data: unknown = null;
  try { data = await response.json(); } catch { data = { message: "A szerver nem JSON választ adott." }; }
  return { ok: response.ok, status: response.status, data: data as T };
}

export function errorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.filter((item) => typeof item === "string").join(" · ");
  }
  return fallback;
}
