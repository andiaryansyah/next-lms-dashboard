import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import DropdownStudents from "@/components/DropdownStudents";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ParentPage = async ({
  searchParams,
}: {
  searchParams: { studentId?: string };
}) => {
  const { userId } = await auth();

  const students = await prisma.student.findMany({
    where: {
      parentId: userId!,
    },
  });

  const selectedStudent = students.find(
    (student) => student.id === searchParams.studentId
  );
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white dark:bg-gray-900 p-4 rounded-md">
          <DropdownStudents students={students} />
          {selectedStudent && (
            <div>
              <h1 className="text-xl font-semibold">
                Schedule ({selectedStudent.name + " " + selectedStudent.surname}
                )
              </h1>
              <BigCalendarContainer
                type="classId"
                id={selectedStudent.classId}
              />
            </div>
          )}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
