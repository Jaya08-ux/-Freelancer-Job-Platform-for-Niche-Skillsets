const API_BASE = "/api";

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("skillniche_token");

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

const getCurrentUser = () => {
  const raw = localStorage.getItem("skillniche_user");
  return raw ? JSON.parse(raw) : null;
};

const setSession = (token, user) => {
  localStorage.setItem("skillniche_token", token);
  localStorage.setItem("skillniche_user", JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem("skillniche_token");
  localStorage.removeItem("skillniche_user");
};
