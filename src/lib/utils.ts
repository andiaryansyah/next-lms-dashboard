// import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

// const { sessionClaims } = auth();
// export const userRole = (sessionClaims?.metadata as { role?: string })?.role;

// const headersList = headers();
// console.log("All headers:", Object.fromEntries(headersList.entries()));

export const role = headers().get("x-user-role");
export const currentUserId = headers().get("x-user-id");
