import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decryptPayload } from "@/lib/session";

// Specify protected and public routes
const protectedRoutes = ["/", "/personal-room", "/upcoming", "/previous", "/recordings","meeting"];
const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // console.log("Middleware Loading" + path);

  const cookie = (await cookies()).get("session")?.value;
  const session = await decryptPayload(cookie);

  // console.log("Session in middleware:", session);

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.id &&
    !req.nextUrl.pathname.startsWith("/")
  ) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
