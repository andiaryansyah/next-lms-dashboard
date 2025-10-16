"use client";

import { Message } from "@prisma/client";
import { useEffect, useRef } from "react";

type MessageListProps = { initialMessages: Message[] };

const MessageList = ({ initialMessages }: MessageListProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [initialMessages]);

  return (
    <ul className="flex flex-col gap-4 overflow-y-auto h-[650px] ">
      {initialMessages && initialMessages.length !== 0 ? (
        initialMessages.map((message) => (
          <li key={message.id}>
            <div className="rounded border p-4 mb-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold">{message.displayName}</span>
                <time className="text-sm text-block">
                  {new Date(message.createdAt).toLocaleDateString()}
                </time>
              </div>
              <div className="mt-2">
                <p className="text-sm">{message.content}</p>
                {/* <div ref={ref} /> */}
              </div>
            </div>
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
