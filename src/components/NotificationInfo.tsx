"use client";
import React from "react";
import { NotificationInfoProps } from "./MessageNotification";
import Link from "next/link";

const NotificationInfo = ({ datas }: { datas: NotificationInfoProps }) => {
  return (
    <div className="overflow-y-auto no-scrollbar absolute top-5 h-[180px] w-[300px] right-7 flex flex-col mb-4 text-sm text-gray-900 rounded-lg bg-purple-300 dark:text-zinc-100">
      {datas ? (
        datas.map((data, index) => (
          <div role="alert" key={index} className="p-1">
            {datas && datas.length > 1 && (
              <div className="w-full border-t border-gray-400" />
            )}
            <Link
              href={`/list/messages/?search=${data.displayName.split(" ")[0]} `}
              key={index}
            >
              <div className="flex flex-col w-full hover:bg-purple-500 p-4 rounded-lg">
                <h1 className="font-extrabold py-2">{data.displayName}</h1>
                <p>
                  {" "}
                  {data.content.length > 100
                    ? `${data.content.substring(0, 100)}...`
                    : data.content}
                </p>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <div className="w-full p-4 rounded-lg">Tidak ada pesan</div>
      )}
    </div>
  );
};

export default NotificationInfo;
