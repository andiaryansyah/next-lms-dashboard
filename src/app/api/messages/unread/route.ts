import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { receiverId } = body;

    if (!receiverId) {
      return NextResponse.json(
        { error: true, message: "Missing receiverId" },
        { status: 400 }
      );
    }

    // Hitung jumlah unread per sender
    const unreadCounts = await prisma.message.groupBy({
      by: ["senderId"],
      where: {
        receiverId,
        isRead: false,
      },
      _count: {
        senderId: true,
      },
    });

    // Ambil detail unread message
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

    return NextResponse.json({
      countData: unreadCounts,
      data: unreadData,
    });
  } catch (error) {
    console.error("Unread API error:", error);
    return NextResponse.json(
      { error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
