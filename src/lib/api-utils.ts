export function createToken(uid: string): string {
  return `${uid}_${Date.now()}_${Math.random().toString(36)}`;
}

export function decodeToken(
  token: string
): { uid: string; timestamp: number } | null {
  try {
    const parts = token.split("_");
    if (parts.length < 2) return null;

    const uid = parts[0];
    const timestamp = parseInt(parts[1]);

    if (!uid || isNaN(timestamp)) return null;

    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) return null;

    return { uid, timestamp };
  } catch {
    return null;
  }
}

export function createErrorResponse(message: string, status: number = 400) {
  return Response.json({ message }, { status });
}

export function createSuccessResponse(data: any, status: number = 200) {
  return Response.json(data, { status });
}
