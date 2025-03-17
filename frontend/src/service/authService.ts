export async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refresh");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  const response = await fetch("http://localhost:8000/api/auth/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }
  const data = await response.json();
  // Asumimos que el endpoint devuelve { "access": "...", "refresh": "..." }
  const newAccessToken = data.access;
  // Actualizamos el refresh token si se nos proporciona uno nuevo
  if (data.refresh) {
    localStorage.setItem("refresh", data.refresh);
  }
  localStorage.setItem("token", newAccessToken);
  return newAccessToken;
}
