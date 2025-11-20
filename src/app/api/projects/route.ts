import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { createErrorResponse, createSuccessResponse, decodeToken } from "@/lib/api-utils";
import { CreateProjectRequest, Project } from "@/types";
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

    const projectsRef = adminDb
      .collection("projects")
      .where("userId", "==", user.uid);
    
    const snapshot = await projectsRef.get();
    const projects: Project[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Project));

    return createSuccessResponse(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return createErrorResponse("Failed to fetch projects", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return createErrorResponse("Unauthorized", 401);
    }

    const { name, description }: CreateProjectRequest = await request.json();

    if (!name?.trim()) {
      return createErrorResponse("Project name is required", 400);
    }

    const projectData = {
      name: name.trim(),
      description: description?.trim() || "",
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection("projects").add(projectData);
    const newProject: Project = { id: docRef.id, ...projectData };

    return createSuccessResponse(newProject, 201);
  } catch (error) {
    console.error('Create project error:', error);
    return createErrorResponse("Failed to create project", 500);
  }
}