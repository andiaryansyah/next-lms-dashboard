import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { receiverId } = body;

  if (!receiverId) {
    return NextResponse.json({ error: "Missing receiverId" }, { status: 400 });
  }

  const unreadCounts = await prisma.message.groupBy({
    by: ["senderId"],
    where: {
      receiverId,
      isRead: false,
    },
    _count: { senderId: true },
  });

  const unreadData = await prisma.message.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      receiverId,
      isRead: false,
    },
    select: {
      content: true,
      displayName: true,
      receiverId: true,
      senderId: true,
      createdAt: true,
    },
  });

  const data = {
    countData: unreadCounts,
    data: unreadData,
  };

  // console.log("unread data: ", data);
  return NextResponse.json(data);
}
