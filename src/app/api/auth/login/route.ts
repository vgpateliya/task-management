import {
  createErrorResponse,
  createSuccessResponse,
  createToken,
} from "@/lib/api-utils";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { verifyPassword } from "@/lib/password";
import { LoginRequest } from "@/types";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginRequest = await request.json();

    if (!email || !password) {
      return createErrorResponse("Email and password are required", 400);
    }

    if (password.length < 6) {
      return createErrorResponse("Invalid credentials", 401);
    }

    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch {
      return createErrorResponse("Invalid credentials", 401);
    }

    const userDoc = await adminDb.collection("users").doc(userRecord.uid).get();

    if (!userDoc.exists) {
      return createErrorResponse("Invalid credentials", 401);
    }

    const userData = userDoc.data();
    const isValidPassword = await verifyPassword(password, userData?.password);
    
    if (!isValidPassword) {
      return createErrorResponse("Invalid credentials", 401);
    }

    const token = createToken(userRecord.uid);

    const response = createSuccessResponse({
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
      },
      token,
    });

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
