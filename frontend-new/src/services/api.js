
const API_BASE_URL = "http://127.0.0.1:8000";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
  };

  // JSON request হলে Content-Type সেট করবে
  // FormData হলে browser নিজে সেট করবে
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Login token থাকলে backend-এ পাঠাবে
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || "Something went wrong"
    );
  }

  return data;
};


// ============================================================
// AUTH
// ============================================================

export const registerUser = async (name, email, password) => {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};


export const loginUser = async (email, password) => {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};


// ============================================================
// WORKSPACES
// ============================================================

export const getWorkspaces = async () => {
  return apiRequest("/api/workspaces/", {
    method: "GET",
  });
};


export const createWorkspace = async (name, description) => {
  return apiRequest("/api/workspaces/", {
    method: "POST",
    body: JSON.stringify({
      name,
      description,
    }),
  });
};


export const getWorkspace = async (workspaceId) => {
  return apiRequest(`/api/workspaces/${workspaceId}`, {
    method: "GET",
  });
};


// ============================================================
// FEEDBACK
// ============================================================

export const uploadFeedback = async (workspaceId, file) => {
  const formData = new FormData();

  formData.append("file", file);

  return apiRequest(`/api/feedback/upload/${workspaceId}`, {
    method: "POST",
    body: formData,
  });
};


// ============================================================
// AI ANALYSIS
// ============================================================

export const analyzeFeedback = async (workspaceId) => {
  return apiRequest(`/api/analysis/${workspaceId}`, {
    method: "POST",
  });
};


// Get latest complete AI analysis
export const getLatestAnalysis = async (workspaceId) => {
  return apiRequest(`/api/analysis/${workspaceId}`, {
    method: "GET",
  });
};


// ============================================================
// INSIGHTS
// ============================================================

export const getInsights = async (workspaceId) => {
  return apiRequest(`/api/analysis/insights/${workspaceId}`, {
    method: "GET",
  });
};


// ============================================================
// FEATURE REQUESTS
// ============================================================

export const getFeatures = async (workspaceId) => {
  return apiRequest(`/api/analysis/features/${workspaceId}`, {
    method: "GET",
  });
};


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default apiRequest;

