import FormContainer from "@/components/FormContainer";
import ModalDescription from "@/components/ModalDescription";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Announcement, Class, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AnnouncementListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  type AnnouncementList = Announcement & { class: Class };

  const { sessionClaims, userId: currentUserId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
    },

    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "actions",
          },
        ]
      : []),
  ];
  const renderRow = async (item: AnnouncementList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-pickPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.class?.name || "All"}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("id-ID").format(item.date)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {/* <ModalDescription description={item.description} /> */}
          <Link href={`/list/announcements/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-pickYellow">
              <Image src="/viewYellow.png" alt="" width={20} height={20} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormContainer table="announcement" type="update" data={item} />
              <FormContainer table="announcement" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams || {};

  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITION
  const query: Prisma.AnnouncementWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  //ROLE CONDITIONS

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  // query.OR = [
  //   { classId: null },
  //   {
  //     class: roleConditions[role as keyof typeof roleConditions] || {},
  //   },
  // ];

  switch (role) {
    case "admin":
      break;
    case "teacher":
    case "student":
    case "parent":
      query.OR = [
        { classId: null },
        {
          class: roleConditions[role as keyof typeof roleConditions] || {},
        },
      ];
      break;
    default:
      query.classId = null;
      break;
  }

  const [announcements, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: { class: true },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
    }),

    prisma.announcement.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold hidden md:block">
          All Announcements
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-pickGreen">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-pickGreen">
              <Image src="/sort.png" alt="sort" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="announcement" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={announcements} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AnnouncementListPage;
