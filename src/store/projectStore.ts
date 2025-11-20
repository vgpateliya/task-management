import { Project, ProjectState, Task } from "@/types";
import { create } from "zustand";

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  tasks: [],
  loading: false,

  setProjects: (projects: Project[]) => set({ projects }),
  setTasks: (tasks: Task[]) => set({ tasks }),
  setLoading: (loading: boolean) => set({ loading }),

  addProject: (project: Project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),

  addTask: (task: Task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (taskId: string, updates: Partial<Task>) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    })),

  deleteTask: (taskId: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
}));
