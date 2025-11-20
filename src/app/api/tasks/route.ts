import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { createErrorResponse, createSuccessResponse, decodeToken } from "@/lib/api-utils";
import { CreateTaskRequest, Task, UpdateTaskRequest } from "@/types";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  try {
    const userRecord = await adminAuth.getUser(decoded.uid);
    return { uid: userRecord.uid, email: userRecord.email || '' };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return createErrorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return createErrorResponse("Project ID is required", 400);
    }

    const tasksRef = adminDb
      .collection("tasks")
      .where("userId", "==", user.uid)
      .where("projectId", "==", projectId);
    
    const snapshot = await tasksRef.get();
    const tasks: Task[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Task));

    return createSuccessResponse(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    return createErrorResponse("Failed to fetch tasks", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return createErrorResponse("Unauthorized", 401);
    }

    const { title, projectId, status = "Todo", dueDate }: CreateTaskRequest = await request.json();

    if (!title?.trim()) {
      return createErrorResponse("Task title is required", 400);
    }

    if (!projectId) {
      return createErrorResponse("Project ID is required", 400);
    }

    const taskData: any = {
      title: title.trim(),
      projectId,
      status,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
    
    if (dueDate) {
      taskData.dueDate = dueDate;
    }
    const docRef = await adminDb.collection("tasks").add(taskData);
    const newTask: Task = { id: docRef.id, ...taskData };

    return createSuccessResponse(newTask, 201);
  } catch (error) {
    console.error('Create task error:', error);
    return createErrorResponse("Failed to create task", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return createErrorResponse("Unauthorized", 401);
    }

    const { id, ...updates }: UpdateTaskRequest = await request.json();

    if (!id) {
      return createErrorResponse("Task ID is required", 400);
    }

    await adminDb.collection("tasks").doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return createSuccessResponse({ id, ...updates });
  } catch (error) {
    console.error('Update task error:', error);
    return createErrorResponse("Failed to update task", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return createErrorResponse("Unauthorized", 401);
    }

    const { id }: { id: string } = await request.json();

    if (!id) {
      return createErrorResponse("Task ID is required", 400);
    }

    await adminDb.collection("tasks").doc(id).delete();
    return createSuccessResponse({ message: "Task deleted successfully" });
  } catch (error) {
    console.error('Delete task error:', error);
    return createErrorResponse("Failed to delete task", 500);
  }
}