// import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

// const { sessionClaims } = auth();
// export const userRole = (sessionClaims?.metadata as { role?: string })?.role;

// const headersList = headers();
// console.log("All headers:", Object.fromEntries(headersList.entries()));

// export const role = headers().get("x-user-role");
// export const currentUserId = headers().get("x-user-id");

export function getAuthHeaders() {
  const header = headers();
  const userId = header.get("x-user-id") ?? null;
  const role = header.get("x-user-role") ?? "guest";

  return { userId, role };
}

const currentWorkWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
  const startOfWeek = new Date(today);

  if (dayOfWeek === 0) {
    startOfWeek.setDate(today.getDate() + 1);
  }

  if (dayOfWeek === 6) {
    startOfWeek.setDate(today.getDate() + 2);
  } else {
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
  }

  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
};

export const adjustScheduleCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
) => {
  const startOfWeek = currentWorkWeek();
  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;
    const adjustedStartDate = new Date(startOfWeek);
    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds(),
      lesson.start.getMilliseconds()
    );

    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds(),
      lesson.end.getMilliseconds()
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};
