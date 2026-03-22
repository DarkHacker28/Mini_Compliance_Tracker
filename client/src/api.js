const API_BASE = (import.meta.env.VITE_API_URL || "") + "/api";

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || error.errors?.[0]?.msg || "Request failed");
  }

  return res.json();
}

export function getClients(search = "") {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  return request(`/clients${params}`);
}

export function getClient(id) {
  return request(`/clients/${id}`);
}

export function getTasks(clientId, filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.category) params.set("category", filters.category);
  if (filters.sort_by) params.set("sort_by", filters.sort_by);
  if (filters.sort_order) params.set("sort_order", filters.sort_order);
  const qs = params.toString();
  return request(`/clients/${clientId}/tasks${qs ? `?${qs}` : ""}`);
}

export function createTask(clientId, task) {
  return request(`/clients/${clientId}/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTaskStatus(taskId, status) {
  return request(`/tasks/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function getCategories() {
  return request("/tasks/categories");
}

export function getStatuses() {
  return request("/tasks/statuses");
}
