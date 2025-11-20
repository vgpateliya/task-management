import { createSuccessResponse } from "@/lib/api-utils";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const response = createSuccessResponse({
    message: "Logged out successfully",
  });

  response.headers.set(
    "Set-Cookie",
    "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict"
  );

  return response;
}
