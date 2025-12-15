import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: true, message: "senderId & receiverId are required" },
        { status: 400 }
      );
    }

    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ error: false, success: true });
  } catch (err) {
    return NextResponse.json(
      { error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
