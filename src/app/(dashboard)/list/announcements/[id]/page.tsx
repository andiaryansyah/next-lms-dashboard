import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Announcement } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const SingleAnnouncementPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const announcement: Announcement | null =
    await prisma.announcement.findUnique({
      where: { id: parseInt(id) },
    });

  if (!announcement) {
    return notFound();
  }

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-zinc-100 p-4 rounded-md flex-1 m-4 mt-0">
      <div>
        <nav className="text-sm text-gray-600 mb-4">
          <Link
            href="/list/announcements"
            className="hover:text-blue-600 transition-colors dark:text-zinc-400 dark:hover:text-blue-400"
          >
            <span className="text-lg font-semibold">All Announcements</span>
          </Link>
          <span className="text-black mx-2 dark:text-zinc-100">/</span>
          <span className="text-black text-lg font-semibold dark:text-zinc-100">
            Announcement
          </span>
        </nav>
      </div>

      <div className="p-4">
        <h2 className="font-semibold hidden md:block">{announcement.title}</h2>
        <div className="mb-10">
          <h5 className="text-sm">
            {new Intl.DateTimeFormat("id-ID").format(announcement.date)}
          </h5>
        </div>
        <p>{announcement.description}</p>
      </div>
    </div>
  );
};

export default SingleAnnouncementPage;
