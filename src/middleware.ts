import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routerAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routerAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routerAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role!)) {
      return NextResponse.redirect(new URL(`{/${role}}`, req.url));
    }
  }

  const res = NextResponse.next();

  // inject role ke headers supaya bisa diakses di server component/page
  if (role) {
    res.headers.set("x-user-role", role);
  }
  if (userId) {
    res.headers.set("x-user-id", userId);
  }

  return res;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
