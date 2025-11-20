import {
  createErrorResponse,
  createSuccessResponse,
  createToken,
} from "@/lib/api-utils";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { hashPassword } from "@/lib/password";
import { RegisterRequest } from "@/types";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password, confirmPassword }: RegisterRequest =
      await request.json();

    if (!email || !password || !confirmPassword) {
      return createErrorResponse(
        "Email, password and confirm password are required",
        400
      );
    }

    if (password.length < 6) {
      return createErrorResponse("Password must be at least 6 characters", 400);
    } else if (password !== confirmPassword) {
      return createErrorResponse("Passwords do not match", 400);
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return createErrorResponse("Invalid email format", 400);
    }

    const hashedPassword = await hashPassword(password);

    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    await adminDb.collection("users").doc(userRecord.uid).set({
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    const token = createToken(userRecord.uid);

    const response = createSuccessResponse(
      {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
        },
        token,
      },
      201
    );

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
    );

    return response;
  } catch (error: any) {
    console.error("Register error:", error);

    if (error.code === "auth/email-already-exists") {
      return createErrorResponse("Email already exists", 409);
    }

    return createErrorResponse("Registration failed", 500);
  }
}
