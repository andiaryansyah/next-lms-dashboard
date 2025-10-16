"use client";
import { useMemo, useState } from "react";
import MessageForm from "@/components/forms/MessageForm";
import MessageListContainer from "@/components/MessageListContainer";
import Image from "next/image";
import TableSearchMessage from "./TableSearchMessage";

export type MessageSidebarProps = {
  id: string;
  displayName: string;
  img?: string | null;
  userId?: string;
  username?: string;
  receivedId?: string;
};

export default function MessagesPageClient({
  users,
  currentUserId,
  senderName,
}: {
  users: MessageSidebarProps[];
  currentUserId: string;
  senderName: string;
}) {
  const [selectedUser, setSelectedUser] = useState<MessageSidebarProps | null>(
    null
  );

  const receivedId = useMemo(() => {
    if (!selectedUser) return null;
    return selectedUser.receivedId
      ? selectedUser.receivedId
      : selectedUser.userId!;
  }, [selectedUser]);

  const messageContainer = useMemo(() => {
    if (!receivedId) return null;
    return (
      <MessageListContainer
        currentUserId={currentUserId}
        receiverId={receivedId}
      />
    );
  }, [currentUserId, receivedId]);

  const messageForm = useMemo(() => {
    if (!receivedId) return null;
    return (
      <MessageForm
        receiverId={receivedId}
        senderName={senderName}
        currentUserId={currentUserId}
      />
    );
  }, [receivedId, senderName, currentUserId]);

  const uniqueUsers = useMemo(() => {
    const seen = new Set();
    return users.filter((user) => {
      const id = user.receivedId || user.userId;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [users]);

  return (
    <div className="h-screen bg-white m-4 flex flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full p-4 bg-white lg:w-1/3 flex flex-col gap-8">
        <div className="h-full flex-grow rounded border p-4 shadow">
          <TableSearchMessage />
          <div className="overflow-y-auto h-[calc(100vh-150px)] mt-6">
            {uniqueUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center p-4 gap-4 cursor-pointer rounded-lg transition-all ${
                  selectedUser?.id === user.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <Image
                  src={"/avatar.png"}
                  alt={""}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">{user.displayName}</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full p-4 lg:w-2/3 flex flex-col gap-8 bg-slate-100">
        {selectedUser ? (
          <div className="flex h-full flex-col gap-4">
            <div className="h-screen flex-grow overflow-hidden rounded border p-4 shadow">
              {messageContainer}
            </div>
            <div>{messageForm}</div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Pilih seseorang untuk memulai percakapan 👋
          </div>
        )}
      </div>
    </div>
  );
}
