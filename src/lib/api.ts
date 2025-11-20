import {
  CreateProjectRequest,
  CreateTaskRequest,
  LoginRequest,
  RegisterRequest,
} from "@/types";
import api from "./axios";

export const authAPI = {
  login: (data: LoginRequest) => api.post("/auth/login", data),
  register: (data: RegisterRequest) => api.post("/auth/register", data),
  verify: () => api.get("/auth/verify"),
  logout: () => api.post("/auth/logout"),
};

export const projectAPI = {
  getAll: () => api.get("/projects"),
  create: (data: CreateProjectRequest) => api.post("/projects", data),
};

export const taskAPI = {
  getByProject: (projectId: string) => api.get(`/tasks?projectId=${projectId}`),
  create: (data: CreateTaskRequest) => api.post("/tasks", data),
  update: (id: string, updates: any) => api.put("/tasks", { id, ...updates }),
  delete: (id: string) => api.delete("/tasks", { data: { id } }),
};
