import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  const client = await clerkClient();

  const admin = await prisma.admin.findUnique({
    where: { username: "admin" },
  });

  if (admin) {
    return Response.json({ error: true, success: false });
  }

  const users = await client.users.getUserList({
    username: ["admin"],
  });

  let user = users.data[0];
  if (!user) {
    user = await client.users.createUser({
      username: "admin",
      password: "admin123",
      firstName: "Admin",
      lastName: "",
      publicMetadata: {
        role: "admin",
      },
    });
  }

  await prisma.user.create({
    data: {
      id: user.id,
      username: user.username || "admin",
      role: "ADMIN",
      displayName: "Admin",
    },
  });

  await prisma.admin.create({
    data: {
      id: user.id,
      username: user.username || "admin",
      userId: user.id,
    },
  });

  return Response.json({ error: false, success: true });
}
