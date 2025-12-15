import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalendar";
import { adjustScheduleCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  let teacherId: string = "";
  let classId: number = 0;

  if (typeof id === "string") {
    teacherId = id;
  } else {
    classId = id;
  }
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: teacherId }
        : { classId: classId }),
    },
  });

  const data = dataRes.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const schedule = adjustScheduleCurrentWeek(data);

  return (
    <div>
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
