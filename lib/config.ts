export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.defrag.app";

export async function fetchBlueprint(payload: any) {
  const token = 'stub-token';

  return fetch(`${API_BASE}/v1/blueprint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
