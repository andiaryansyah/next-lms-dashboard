"use client";

import { Message } from "@prisma/client";
import { useEffect, useRef } from "react";

type MessageListProps = { initialMessages: Message[] };

const DateNow = new Date();
const MessageList = ({ initialMessages }: MessageListProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const showDate = (messageCurrentDate: Date, index: number) => {
    const currentDate = new Date(messageCurrentDate).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }
    );

    const prevDate =
      index > 0
        ? new Date(initialMessages[index - 1].createdAt).toLocaleDateString(
            "id-ID",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            }
          )
        : null;

    const showMessageDate = currentDate !== prevDate;

    if (showMessageDate) {
      return (
        <div className="py-2 flex items-center justify-center">
          <time className="text-sm text-block font-bold">{currentDate}</time>
        </div>
      );
    }
  };
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [initialMessages]);

  return (
    <ul className="flex flex-col gap-4 overflow-y-auto h-[650px] ">
      {initialMessages && initialMessages.length !== 0 ? (
        initialMessages.map((message, index) => (
          <li key={message.id}>
            {showDate(message.createdAt, index)}
            <div className="rounded border p-4 mb-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold">{message.displayName}</span>
                <time className="text-sm text-block">
                  {new Date(message.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </time>
              </div>
              <div className="mt-2">
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
            <div ref={ref} />
          </li>
        ))
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Tidak ada pesan
        </div>
      )}
    </ul>
  );
};

export default MessageList;
