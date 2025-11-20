"use client";

import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { authAPI, projectAPI, taskAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useProjectStore } from "@/store/projectStore";
import { CreateProjectRequest, CreateTaskRequest, Task } from "@/types";
import { Add as AddIcon, Logout as LogoutIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const {
    projects,
    tasks,
    setProjects,
    setTasks,
    addProject,
    addTask,
    updateTask,
    deleteTask,
  } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);
  const [taskProjectId, setTaskProjectId] = useState<string>("");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects?.length > 0) {
      fetchAllTasks();
    }
  }, [projects]);

  const fetchProjects = async (): Promise<void> => {
    const response = await projectAPI.getAll();
    setProjects(Array.isArray(response.data) ? response.data : []);
  };

  const fetchAllTasks = async (): Promise<void> => {
    const allTasks: Task[] = [];
    for (const project of projects) {
      const response = await taskAPI.getByProject(project.id);
      if (Array.isArray(response.data)) {
        allTasks.push(...response.data);
      }
    }
    setTasks(allTasks);
  };

  const handleAddProject = async (
    projectData: CreateProjectRequest
  ): Promise<void> => {
    try {
      const response = await projectAPI.create(projectData);
      addProject(response.data);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleAddTask = async (taskData: CreateTaskRequest): Promise<void> => {
    try {
      const response = await taskAPI.create(taskData);
      addTask(response.data);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    updates: Partial<Task>
  ): Promise<void> => {
    await taskAPI.update(taskId, updates);
    updateTask(taskId, updates);
  };

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    await taskAPI.delete(taskId);
    deleteTask(taskId);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    logout();
    window.location.href = "/login";
  };

  const selectedProjectData = projects?.find((p) => p?.id === selectedProject);

  return (
    <>
      <AppBar position="static">
        <Toolbar className="flex flex-col sm:flex-row gap-2">
          <Typography variant="h6" className="flex-1">
            Task Manager Dashboard
          </Typography>
          <Typography variant="body2" className="mr-4">
            {user?.email}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="py-8">
        {!selectedProject ? (
          <>
            <Box className="flex justify-between items-center mb-6">
              <Typography variant="h4" className="font-semibold">
                Projects
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setProjectModalOpen(true)}
              >
                Add Project
              </Button>
            </Box>

            <Grid container spacing={3}>
              {projects?.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project?.id}>
                  <ProjectCard
                    project={project}
                    tasks={tasks}
                    onAddTask={(projectId: string) => {
                      setTaskProjectId(projectId);
                      setTaskModalOpen(true);
                    }}
                    onSelectProject={setSelectedProject}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            <Box className="flex justify-between items-center mb-6">
              <Typography variant="h4" className="font-semibold">
                {selectedProjectData?.name} - Tasks
              </Typography>
              <Box className="space-x-2">
                <Button
                  variant="outlined"
                  onClick={() => setSelectedProject(null)}
                >
                  Back to Projects
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setTaskProjectId(selectedProject);
                    setTaskModalOpen(true);
                  }}
                >
                  Add Task
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Typography
                    variant="h6"
                    className="mb-3 text-gray-700 font-medium"
                  >
                    Todo
                  </Typography>
                  <div>
                    {(tasks || [])
                      .filter(
                        (task) =>
                          task.projectId === selectedProject &&
                          task.status === "Todo"
                      )
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onUpdateTask={handleUpdateTask}
                          onDeleteTask={handleDeleteTask}
                        />
                      ))}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div className="bg-blue-50 rounded-lg p-4">
                  <Typography
                    variant="h6"
                    className="mb-3 text-blue-700 font-medium"
                  >
                    In Progress
                  </Typography>
                  <div>
                    {(tasks || [])
                      .filter(
                        (task) =>
                          task.projectId === selectedProject &&
                          task.status === "In Progress"
                      )
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onUpdateTask={handleUpdateTask}
                          onDeleteTask={handleDeleteTask}
                        />
                      ))}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div className="bg-green-50 rounded-lg p-4">
                  <Typography
                    variant="h6"
                    className="mb-3 text-green-700 font-medium"
                  >
                    Done
                  </Typography>
                  <div>
                    {(tasks || [])
                      .filter(
                        (task) =>
                          task.projectId === selectedProject &&
                          task.status === "Done"
                      )
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onUpdateTask={handleUpdateTask}
                          onDeleteTask={handleDeleteTask}
                        />
                      ))}
                  </div>
                </div>
              </Grid>
            </Grid>
          </>
        )}
      </Container>

      <ProjectModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={handleAddProject}
      />

      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleAddTask}
        projectId={taskProjectId}
      />
    </>
  );
}
