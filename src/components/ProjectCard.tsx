"use client";

import { ProjectCardProps } from "@/types";
import { Add as AddIcon } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

export default function ProjectCard({
  project,
  tasks,
  onAddTask,
  onSelectProject,
}: ProjectCardProps) {
  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const todoCount = projectTasks.filter(
    (task) => task.status === "Todo"
  ).length;
  const inProgressCount = projectTasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const doneCount = projectTasks.filter(
    (task) => task.status === "Done"
  ).length;

  return (
    <Card className="h-full">
      <CardContent>
        <Typography variant="h6" className="mb-2 font-medium">
          {project.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-4">
          {project.description}
        </Typography>

        <Box className="mb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Todo: {todoCount}</span>
            <span>In Progress: {inProgressCount}</span>
            <span>Done: {doneCount}</span>
          </div>
        </Box>

        <Box className="flex gap-2">
          <Button
            variant="outlined"
            size="small"
            onClick={() => onSelectProject(project.id)}
            className="flex-1"
          >
            View Tasks
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => onAddTask(project.id)}
          >
            Add Task
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
