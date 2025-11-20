"use client";

import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { LoginRequest, User } from "@/types";
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
}

interface FormErrors {
  email: string;
  password: string;
  general: string;
}

const LoginPage = memo(() => {
  const router = useRouter();
  const { setUser, loading: authLoading } = useAuthStore();
  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    general: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const validateField = useCallback((name: keyof FormState, value: string) => {
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
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  }, []);

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
      formData.email && formData.password && !errors.email && !errors.password
    );
  }, [formData, errors]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors((prev) => ({ ...prev, general: "" }));

      const emailValid = validateField("email", formData.email);
      const passwordValid = validateField("password", formData.password);

      if (!emailValid || !passwordValid) return;

      setLoading(true);

      try {
        const requestData: LoginRequest = {
          email: formData.email,
          password: formData.password,
        };
        const response = await authAPI.login(requestData);

        const userData: User = response.data.user;
        const token = response.data.token;

        localStorage.setItem("token", token);
        setUser({ ...userData, token });

        window.location.href = "/dashboard";
      } catch (err: any) {
        setErrors((prev) => ({
          ...prev,
          general: err.response?.data?.message || "Login failed",
        }));
      } finally {
        setLoading(false);
      }
    },
    [formData, validateField, setUser, router]
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
            Welcome Back
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Sign in to your account
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
            helperText={errors.password}
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
            {loading ? "Logging in..." : "Sign In"}
          </Button>
        </form>

        <Box className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 font-medium">
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
});

export default LoginPage;
