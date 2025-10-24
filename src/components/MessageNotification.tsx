"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import NotificationInfo from "./NotificationInfo";

export type NotificationInfoProps = {
  content: string;
  displayName: string;
  receiverId: string;
  senderId: string;
  createdAt?: Date;
}[];

const MessageNotification = ({ currentUserId }: { currentUserId: string }) => {
  const [open, setOpen] = useState(false);

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

  const notificationData: NotificationInfoProps = unread ? unread.data : [];

  // console.log("notif: ", notificationData);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative"
      onClick={() => setOpen(!open)}
    >
      <Image
        src="/message.png"
        alt="message"
        width={28}
        height={28}
        className="invert dark:brightness-0"
      />
      {open && <NotificationInfo datas={notificationData} />}
      {notificationData && notificationData.length !== 0 && (
        <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
          {notificationData.length}
        </div>
      )}
    </div>
  );
};

export default MessageNotification;
