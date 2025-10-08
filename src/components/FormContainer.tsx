import { prisma } from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};
const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;

      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });

        relatedData = { teachers: classTeachers, grades: classGrades };
        break;

      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });

        relatedData = { teacherSubjects: teacherSubjects };
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });

        relatedData = { grades: studentGrades, classes: studentClasses };
        break;
      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: { ...(role === "teacher" ? { teacherId: userId! } : {}) },
          select: { id: true, name: true },
        });
        const examTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });

        relatedData = { lessons: examLessons, teachers: examTeachers };
        break;
      case "assignment":
        const assignmentLessons = await prisma.lesson.findMany({
          where: { ...(role === "teacher" ? { teacherId: userId! } : {}) },
          select: { id: true, name: true },
        });

        relatedData = { lessons: assignmentLessons };
        break;

      case "lesson":
        const lessonClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        const lessonTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        const lessonSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });

        relatedData = {
          teachers: lessonTeachers,
          classes: lessonClasses,
          subjects: lessonSubjects,
        };
        break;
      case "event":
        const eventClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });

        relatedData = { classes: eventClasses };
        break;
      case "announcement":
        const announcementClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });

        relatedData = { classes: announcementClasses };
        break;

      case "result":
        const resultExams = await prisma.exam.findMany({
          select: { id: true, title: true },
        });

        const resultAssignment = await prisma.assignment.findMany({
          select: { id: true, title: true },
        });

        // const resultStudent = await prisma.student.findMany({
        //   where: {
        //     classId: resultExams.
        //   }
        // })

        relatedData = { exams: resultExams, assignments: resultAssignment };
        break;

      default:
        break;
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
