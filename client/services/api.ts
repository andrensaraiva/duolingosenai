const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  fetchAcademy() {
    return request('/academy/path');
  },
  fetchLesson(lessonId: string) {
    return request(`/academy/lessons/${lessonId}`);
  },
  completeLesson(lessonId: string, payload: Record<string, unknown>) {
    return request(`/academy/lessons/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  changeTheme(themeId: string) {
    return request(`/academy/themes/${themeId}`, {
      method: 'POST',
    });
  },
  fetchArena() {
    return request('/arena/challenges');
  },
  fetchMissions() {
    return request('/missions');
  },
};
