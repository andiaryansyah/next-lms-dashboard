import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { currentUserId, receiverId } = body;

  if (!currentUserId || !receiverId) {
    return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: currentUserId, receiverId: receiverId },
        { senderId: receiverId, receiverId: currentUserId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}
