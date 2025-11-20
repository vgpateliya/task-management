export interface User {
  uid: string;
  email: string;
  token?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: string;
  projectId: string;
  userId: string;
  createdAt: string;
}

export type TaskStatus = "Todo" | "In Progress" | "Done";

export interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export interface ProjectState {
  projects: Project[];
  tasks: Task[];
  loading: boolean;
  setProjects: (projects: Project[]) => void;
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  addProject: (project: Project) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
}

export interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
}

export interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  onAddTask: (projectId: string) => void;
  onSelectProject: (projectId: string) => void;
}

export interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, "id" | "userId" | "createdAt">) => void;
  projectId: string;
}

export interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (projectData: Omit<Project, "id" | "userId" | "createdAt">) => void;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface CreateTaskRequest {
  title: string;
  projectId: string;
  status?: TaskStatus;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  id: string;
  title?: string;
  status?: TaskStatus;
  dueDate?: string;
}
