import MessageClient from "@/components/MessageClient";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import React from "react";

const MessagesPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  const query = searchParams.search || "";

  const fullName: string =
    user?.firstName + (user?.lastName ? ` ${user?.lastName}` : "");

  const [teachers, students, parents] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              // { id: { contains: query, mode: "insensitive" } },
            ],
          }
        : {
            user: {
              OR: [
                { messagesSent: { some: { receiverId: user?.id! } } },
                { messagesReceived: { some: { senderId: user?.id! } } },
              ],
            },
          },

      select: { id: true, name: true, img: true, user: true },
    }),
    prisma.student.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              // { id: { contains: query, mode: "insensitive" } },
            ],
          }
        : {
            user: {
              OR: [
                { messagesSent: { some: { receiverId: user?.id! } } },
                { messagesReceived: { some: { senderId: user?.id! } } },
              ],
            },
          },

      select: { id: true, name: true, img: true, user: true },
    }),
    prisma.parent.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              // { id: { contains: query, mode: "insensitive" } },
            ],
          }
        : {
            user: {
              OR: [
                { messagesSent: { some: { receiverId: user?.id! } } },
                { messagesReceived: { some: { senderId: user?.id! } } },
              ],
            },
          },

      select: { id: true, name: true, user: true },
    }),
  ]);

  const allUsers = [
    ...teachers.map((teacher) => ({
      id: teacher.id,
      displayName: teacher.name,
      img: teacher.img,
      receivedId: teacher.user.id,
      username: teacher.user.username,
    })),
    ...students.map((student) => ({
      id: student.id,
      displayName: student.name,
      img: student.img,
      receivedId: student.user.id,
      username: student.user.username,
    })),
    ...parents.map((parent) => ({
      id: parent.id,
      displayName: parent.name,
      img: null,
      receivedId: parent.user.id,
      username: parent.user.username,
    })),
  ];

  // console.log("all users: ", allUsers);

  return (
    <MessageClient
      users={allUsers}
      currentUserId={user?.id!}
      senderName={fullName}
    />
  );
};

export default MessagesPage;
