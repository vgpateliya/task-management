"use client";

import { TaskCardProps, TaskStatus } from "@/types";
import {
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

export default function TaskCard({
  task,
  onUpdateTask,
  onDeleteTask,
}: TaskCardProps) {
  const handleStatusChange = (newStatus: TaskStatus): void => {
    onUpdateTask(task.id, { status: newStatus });
  };

  return (
    <Card className="mb-3">
      <CardContent className="pb-4">
        <Box className="flex justify-between items-start mb-2">
          <Typography variant="h6" className="flex-1 font-medium">
            {task.title}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onDeleteTask(task.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        <Box className="flex items-center justify-between">
          <Select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            size="small"
            className="min-w-32"
          >
            <MenuItem value="Todo">Todo</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>

          {task.dueDate && (
            <Box className="flex items-center text-gray-600 text-sm">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {new Date(task.dueDate).toLocaleDateString()}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
