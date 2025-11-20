"use client";

import { TaskModalProps, TaskStatus } from "@/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

interface FormErrors {
  title: string;
  status: string;
}

export default function TaskModal({
  open,
  onClose,
  onSubmit,
  projectId,
}: TaskModalProps) {
  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<TaskStatus>("Todo");
  const [dueDate, setDueDate] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    title: "",
    status: "",
  });

  const validateField = useCallback((name: keyof FormErrors, value: string) => {
    let error = "";

    switch (name) {
      case "title":
        if (!value) error = "Title is required";
        break;
      case "status":
        if (!value) error = "Status is required";
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  }, []);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTitle(value);
      if (errors.title) {
        validateField("title", value);
      }
    },
    [errors.title, validateField]
  );

  const handleTitleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      validateField("title", e.target.value);
    },
    [validateField]
  );

  const isFormValid = useMemo(() => {
    return title && status && !errors.title && !errors.status;
  }, [title, status, errors]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const titleValid = validateField("title", title);
    const statusValid = validateField("status", status);

    if (!titleValid || !statusValid) return;

    const taskData = {
      title,
      status,
      dueDate: dueDate || undefined,
      projectId,
    };

    onSubmit(taskData);
    setTitle("");
    setStatus("Todo");
    setDueDate("");
    setErrors({ title: "", status: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Task</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4">
          <TextField
            fullWidth
            label="Task Title"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            error={!!errors.title}
            helperText={errors.title}
            required
            className="mb-4"
          />

          <FormControl fullWidth className="mb-4">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              label="Status"
            >
              <MenuItem value="Todo">Todo</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={!isFormValid}>
            Add Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
