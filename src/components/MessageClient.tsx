"use client";
import { useMemo, useState } from "react";
import MessageForm from "@/components/forms/MessageForm";
import MessageListContainer from "@/components/MessageListContainer";
import Image from "next/image";
import TableSearchMessage from "./TableSearchMessage";
import useSWR from "swr";

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

  const fetcher = (url: string, body: any) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json());

  const { data: unread, mutate } = useSWR(
    ["/api/messages/unread", { receiverId: currentUserId }],
    ([url, body]) => fetcher(url, body),
    {
      refreshInterval: 3000,
    }
  );

  const unreadMap = Object.fromEntries(
    (unread && unread.countData ? unread.countData : []).map((item: any) => [
      item.senderId,
      item._count.senderId,
    ])
  );

  const handleSelect = async (user: MessageSidebarProps) => {
    setSelectedUser(user);

    await fetch("/api/messages/read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId: user.id, receiverId: currentUserId }),
    });

    mutate();
  };

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
    <div className="h-screen bg-white dark:bg-gray-900 m-4 flex flex-col md:flex-row rounded-lg">
      {/* LEFT */}
      <div className="w-full p-4 bg-white dark:bg-gray-900  lg:w-1/3 flex flex-col gap-8 rounded-lg">
        <div className="h-full flex-grow rounded border p-4 shadow">
          <TableSearchMessage />
          <div className="overflow-y-auto h-[calc(100vh-150px)] mt-6">
            {uniqueUsers.map((user) => {
              const notifCount = unreadMap[user.id] || 0;
              return (
                <div
                  key={user.id}
                  onClick={() => handleSelect(user)}
                  className={`flex items-center justify-between p-4 gap-4 cursor-pointer rounded-lg transition-all mt-2  ${
                    selectedUser?.id === user.id
                      ? "bg-blue-100 dark:text-gray-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-300 dark:hover:text-gray-900 "
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={"/avatar.png"}
                      alt={""}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold">{user.displayName}</p>
                      {/* <p className="text-xs text-gray-500">Online</p> */}
                    </div>
                  </div>
                  {notifCount > 0 && (
                    <div className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {notifCount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full p-4 lg:w-2/3 flex flex-col gap-8 bg-slate-100 dark:bg-gray-900 rounded-lg">
        {selectedUser ? (
          <div className="flex h-full flex-col gap-4">
            <div className="h-screen flex-grow overflow-hidden rounded border p-4 shadow">
              {messageContainer}
            </div>
            <div>{messageForm}</div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select someone to start a conversation with 👋
          </div>
        )}
      </div>
    </div>
  );
}
