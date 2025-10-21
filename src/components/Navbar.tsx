import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";

const Navbar = async () => {
  const user = await currentUser();
  return (
    <div className="flex items-center justify-between p-4 dark:bg-gray-800">
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* {user && user.username !== "admin" && (
          <div className="bg-white dark:bg-gray-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
            <Image src="/message.png" alt="message" width={28} height={28} />
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image
            src="/announcement.png"
            alt="announcement"
            width={28}
            height={28}
          />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div> */}
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">
            {user?.username}
          </span>
          <span className="text-[10px] text-gray-500 text-right">
            {user?.publicMetadata.role as string}
          </span>
        </div>
        {/* <Image
          src="/avatar.png"
          alt="avatar"
          width={36}
          height={36}
          className="rounded-full"
        /> */}
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
