"use client";

import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { RegisterRequest, User } from "@/types";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email: string;
  password: string;
  confirmPassword: string;
  general: string;
}

const RegisterPage = memo(() => {
  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const { setUser, loading: authLoading } = useAuthStore();
  const router = useRouter();

  const validateField = useCallback(
    (name: keyof FormState, value: string) => {
      let error = "";

      switch (name) {
        case "email":
          if (!value) error = "Email is required";
          else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid";
          break;
        case "password":
          if (!value) error = "Password is required";
          else if (value.length < 6)
            error = "Password must be at least 6 characters";
          break;
        case "confirmPassword":
          if (!value) error = "Please confirm your password";
          else if (value !== formData.password)
            error = "Passwords do not match";
          break;
      }

      setErrors((prev) => ({ ...prev, [name]: error }));
      return error === "";
    },
    [formData.password]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormErrors]) {
        validateField(name as keyof FormState, value);
      }
    },
    [errors, validateField]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      validateField(name as keyof FormState, value);
    },
    [validateField]
  );

  const isFormValid = useMemo(() => {
    return (
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword
    );
  }, [formData, errors]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors((prev) => ({ ...prev, general: "" }));

      const emailValid = validateField("email", formData.email);
      const passwordValid = validateField("password", formData.password);
      const confirmPasswordValid = validateField(
        "confirmPassword",
        formData.confirmPassword
      );

      if (!emailValid || !passwordValid || !confirmPasswordValid) return;

      setLoading(true);

      try {
        const requestData: RegisterRequest = {
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };
        const response = await authAPI.register(requestData);

        const userData: User = response.data.user;
        const token = response.data.token;

        localStorage.setItem("token", token);
        setUser({ ...userData, token });
        window.location.href = "/dashboard";
      } catch (err: any) {
        setErrors((prev) => ({
          ...prev,
          general: err.response?.data?.message || "Registration failed",
        }));
      } finally {
        setLoading(false);
      }
    },
    [formData, validateField, setUser]
  );

  if (authLoading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="sm"
      className="min-h-screen flex items-center justify-center"
    >
      <Paper className="p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <Typography variant="h4" className="font-semibold mb-2">
            Join Us Today
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Create your account to get started
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.email}
            helperText={errors.email}
            variant="outlined"
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.password}
            helperText={
              errors.password || "Password must be at least 6 characters"
            }
            variant="outlined"
          />
          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            variant="outlined"
          />

          {errors.general && (
            <Typography color="error" className="text-sm bg-red-50 p-3 rounded">
              {errors.general}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !isFormValid}
            className="mt-6"
            size="large"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <Box className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium">
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
});

export default RegisterPage;
