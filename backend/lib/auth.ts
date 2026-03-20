import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as string,
      type: payload.type as string,
    };
  } catch (error) {
    return null;
  }
}
