export const ROUTES = {
  home: "/",
  auth: {
    login: "/login",
    register: "/register",
  },
  dashboard: {
    dashboard: "/dashboard",
  },
};

export const APIS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    verify: "/api/auth/verify",
  },
  dashboard: {
    projects: "/api/projects",
    tasks: "/api/tasks",
  },
};

// Public routes and api auth routes
export const publicRoutes = ["/login", "/register"];
export const apiAuthRoutes = ["/api/auth/login", "/api/auth/register"];
