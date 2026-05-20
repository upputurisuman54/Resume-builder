const BASE = "http://localhost:8080";

async function req(method, path, data) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const options = { method, headers };

  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${BASE}${path}`, options);

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `${res.status}`);
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const api = {
  login: (data) => req("POST", "/api/auth/login", data),
  register: (data) => req("POST", "/api/auth/register", data),

  listResumes: () => req("GET", "/api/resume/my"),
  getResume: (id) => req("GET", `/api/resume/my`).then(list => list.find(r => r.id === id)),
  createResume: (data) => req("POST", "/api/resume", data),
  updateResume: (id, data) => req("PUT", `/api/resume/${id}`, data),
  deleteResume: (id) => req("DELETE", `/api/resume/${id}`),

  enhanceResume: (id) => req("POST", `/api/resume/${id}/enhance`),
  getSuggestions: (id, jobTitle) => req("POST", `/api/resume/${id}/suggestions`, { jobTitle }),

  downloadPdf: async (id, name) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE}/api/resume/${id}/download`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "resume"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  },
};