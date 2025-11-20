"use client";

import { CreateProjectRequest, ProjectModalProps } from "@/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

interface FormErrors {
  name: string;
}

export default function ProjectModal({
  open,
  onClose,
  onSubmit,
}: ProjectModalProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
  });

  const validateField = useCallback(
    (fieldName: keyof FormErrors, value: string) => {
      let error = "";

      if (fieldName === "name" && !value) {
        error = "Project name is required";
      }

      setErrors((prev) => ({ ...prev, [fieldName]: error }));
      return error === "";
    },
    []
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setName(value);
      if (errors.name) {
        validateField("name", value);
      }
    },
    [errors.name, validateField]
  );

  const handleNameBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      validateField("name", e.target.value);
    },
    [validateField]
  );

  const isFormValid = useMemo(() => {
    return name && !errors.name;
  }, [name, errors.name]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const nameValid = validateField("name", name);
    if (!nameValid) return;

    const projectData: CreateProjectRequest = { name, description };
    onSubmit(projectData);

    setName("");
    setDescription("");
    setErrors({ name: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Project</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4">
          <TextField
            fullWidth
            label="Project Name"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            error={!!errors.name}
            helperText={errors.name}
            required
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={!isFormValid}>
            Add Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
