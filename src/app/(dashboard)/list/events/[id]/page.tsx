import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Announcement, Event } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const SingleEventPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const event: Event | null = await prisma.event.findUnique({
    where: { id: parseInt(id) },
  });

  if (!event) {
    return notFound();
  }

  const dateTimeSelection = (startTime: Date, endTime: Date) => {
    const startDate = new Intl.DateTimeFormat("id-ID").format(startTime);
    const endDate = new Intl.DateTimeFormat("id-ID").format(endTime);

    if (startDate === endDate) {
      return startDate;
    } else {
      const resultDate = startDate + " - " + endDate;
      return resultDate;
    }
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div>
        <nav className="text-sm text-gray-600 mb-4">
          <Link
            href="/list/events"
            className="hover:text-blue-600 transition-colors"
          >
            <span className="text-lg font-semibold">All Events</span>
          </Link>
          <span className="text-black mx-2">/</span>
          <span className="text-black text-lg font-semibold">Event</span>
        </nav>
      </div>

      <div className="p-4">
        <h2 className="font-semibold hidden md:block">{event.title}</h2>
        <div className="mb-10">
          <h5 className="text-sm">
            {dateTimeSelection(event.startTime, event.endTime)}
          </h5>
        </div>
        <p>{event.description}</p>
      </div>
    </div>
  );
};

export default SingleEventPage;
