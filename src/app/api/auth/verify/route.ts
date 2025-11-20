import { createErrorResponse, createSuccessResponse, decodeToken } from "@/lib/api-utils";
import { adminAuth } from "@/lib/firebase-admin";
import { User } from "@/types";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return createErrorResponse("Token required", 401);
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      return createErrorResponse("Invalid or expired token", 401);
    }

    try {
      const userRecord = await adminAuth.getUser(decoded.uid);
      const userData: Omit<User, "token"> = {
        uid: userRecord.uid,
        email: userRecord.email || "",
      };

      return createSuccessResponse(userData);
    } catch {
      return createErrorResponse("Invalid or expired token", 401);
    }
  } catch (error) {
    console.error("Verify error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
