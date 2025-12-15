import prisma from "@/lib/prisma";
import { Message, Prisma } from "@prisma/client";
import React, { useMemo } from "react";
import MessageList from "./MessageList";
import useSWR from "swr";

const MessageListContainer = ({
  currentUserId,
  receiverId,
}: {
  currentUserId: string;
  receiverId: string | null;
}) => {
  // console.log("currentUserId container: ", currentUserId);
  // console.log("receivedId container: ", receiverId);

  const fetcher = (url: string, body: any) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json());

  const shouldFetch = Boolean(currentUserId && receiverId);

  const {
    data: messages,
    error,
    isLoading,
  } = useSWR(
    shouldFetch ? ["/api/messages", { currentUserId, receiverId }] : null,
    ([url, body]) => fetcher(url, body),
    {
      fallbackData: { messages: [] },
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 100,
    }
  );

  // console.log("messages in list container: ", messages);

  const messagesData = useMemo(() => {
    if (!messages) return null;
    const msgs: Message[] = messages.messages;
    return <MessageList initialMessages={msgs} />;
  }, [messages]);

  if (!messages || isLoading) {
    return <MessageList initialMessages={[]} />;
  }

  if (!currentUserId && receiverId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data
      </div>
    );
  }

  return <div>{messagesData}</div>;
};

export default MessageListContainer;
