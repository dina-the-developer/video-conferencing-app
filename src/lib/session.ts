import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "@/lib/definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

const cookieSecretKey = process.env.COOKIE_SECRET;
const cookieEncodedKey = new TextEncoder().encode(cookieSecretKey);

// Payload encryption function using JWT.
export async function encryptPayload(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("https://video-conferencing-app-peach.vercel.app/")
    .setAudience("https://video-conferencing-app-peach.vercel.app/")
    .setExpirationTime("2h")
    .sign(encodedKey);
}

// Payload decryption function using JWT.
export async function decryptPayload(session: string | undefined = "") {
  if (!session) return undefined;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log(error);
    console.log("Failed to verify session");
  }
}

// Create session function for login.
export async function createSession(id: string, email: string, name: string) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encryptPayload({
    id,
    expiresAt,
    email,
    username: name,
  });
  console.log("Session created:", session);
  const cookie = await cookies();
  cookie.set("session", session, {
    expires: expiresAt,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/", // Set the cookie path to the root of the domain.
  });
}

// Verify session function for protected routes.
export async function updateSession() {
  const cookieStore = await cookies();
  const session = await cookieStore.get("session")?.value;
  const payload = await decryptPayload(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  cookieStore.set("session", session, {
    expires: expires,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}

// Destroy session function for logout.
export async function destroySession() {
  const cookieStore = await cookies();
  const session = await cookieStore.get("session")?.value;
  if(!session){
    console.log("No session found to destroy");
    return;
  }
  cookieStore.delete("session");
  redirect("/login");
}
// Get current session function to check if user is logged in.
export async function currentSession() {
  const cookieStore = await cookies();
  const session = await cookieStore.get("session")?.value;
  const payload = await decryptPayload(session);

  const id = payload?.id as string;
  try {
    const user_id = await jwtVerify(id, cookieEncodedKey, {
      algorithms: ["HS256"],
    });
    if (!user_id) {
      console.log("User ID not found");
      return null;
    }
    const user = {
      id: user_id.payload.id as string,
      email: payload?.email as string,
      username: payload?.username as string,
      expiresAt: payload?.expiresAt as string,
    }
    return user;
  } catch (error) {
    console.log(error);
    console.log("Failed to verify session");
  }
}
