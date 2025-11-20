"use client";

import { Box, CircularProgress } from "@mui/material";

export default function Home() {
  return (
    <Box className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <CircularProgress size={40} className="mb-4" />
        <div className="text-xl font-medium text-gray-700">Task Manager</div>
        <div className="text-gray-500 mt-2">Loading...</div>
      </div>
    </Box>
  );
}
