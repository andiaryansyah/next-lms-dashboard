import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const Announcements = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
  });

  return (
    <div className="bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Announcements</h1>
        <Link href={"/list/announcements"}>
          <span className="text-xs text-gray-400">View All</span>
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {data[0] && (
          <div className="bg-pickSkyLight dark:bg-gray-800 rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[0].title}</h2>
              <span className="text-xs text-gray-400 bg-white dark:bg-gray-900 rounden-md px-1 py-1">
                {new Intl.DateTimeFormat("id-ID").format(data[0].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {data[0].description.length > 100
                ? `${data[0].description.substring(0, 100)}...`
                : data[0].description}
            </p>
          </div>
        )}
        {data[1] && (
          <div className="bg-pickYellowLight dark:bg-gray-800 rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[1].title}</h2>
              <span className="text-xs text-gray-400 bg-white dark:bg-gray-900 rounden-md px-1 py-1">
                {new Intl.DateTimeFormat("id-ID").format(data[1].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[1].description}</p>
          </div>
        )}
        {data[2] && (
          <div className="bg-pickPurpleLight dark:bg-gray-800 rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[2].title}</h2>
              <span className="text-xs text-gray-400 bg-white dark:bg-gray-900 rounden-md px-1 py-1">
                {new Intl.DateTimeFormat("id-ID").format(data[2].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
