"use server";

import { revalidatePath } from "next/cache";
import { ServerActionError } from "../errors";
import {
  AnnouncementInputs,
  AssignmentInputs,
  ClassInputs,
  EventInputs,
  ExamInputs,
  LessonInputs,
  MessageInputs,
  ParentInputs,
  ResultInputs,
  StudentInputs,
  SubjectInputs,
  TeacherInputs,
} from "../formValidationSchema";
import prisma from "../prisma";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type currentState = { success: boolean; error: boolean | string };

//SUBJECTS ACTIONS

export const createSubject = async (
  currentState: currentState,
  data: SubjectInputs
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const updateSubject = async (
  currentState: currentState,
  data: SubjectInputs
) => {
  try {
    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const deleteSubject = async (
  currentState: currentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: { id: parseInt(id) },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

//CLASS ACTIONS

export const createClass = async (
  currentState: currentState,
  data: ClassInputs
) => {
  try {
    await prisma.class.create({
      data,
    });

    // revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const updateClass = async (
  currentState: currentState,
  data: ClassInputs
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const deleteClass = async (
  currentState: currentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

//TEACHER ACTIONS

export const createTeacher = async (
  currentState: currentState,
  data: TeacherInputs
) => {
  try {
    if (data.phone) {
      const existingPhone = await prisma.teacher.findUnique({
        where: { phone: data.phone },
      });

      if (existingPhone) {
        return { success: false, error: "Phone number already exists" };
      }
    }

    const client = await clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: {
        role: "teacher",
      },
    });

    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        username: user.id,
        role: "TEACHER",
        displayName: data.name + (data.surname ? ` ${data.surname}` : ""),
      },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        gender: data.gender,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId) => ({
            id: parseInt(subjectId),
          })),
        },
        userId: user.id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    // console.log(error);
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const updateTeacher = async (
  currentState: currentState,
  data: TeacherInputs
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    if (data.phone) {
      const existingPhone = await prisma.teacher.findUnique({
        where: { phone: data.phone },
      });

      if (existingPhone) {
        return { success: false, error: "Phone number already exists" };
      }
    }

    const client = await clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });
    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        gender: data.gender,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId) => ({
            id: parseInt(subjectId),
          })),
        },
        userId: user.id,
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const deleteTeacher = async (
  currentState: currentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    (await clerkClient()).users.deleteUser(id);
    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

//STUDENT ACTIONS

export const createstudent = async (
  currentState: currentState,
  data: StudentInputs
) => {
  const classItem = await prisma.class.findUnique({
    where: { id: data.classId },
    include: { _count: { select: { students: true } } },
  });

  if (classItem && classItem.capacity === classItem._count.students) {
    return { success: false, error: true };
  }
  try {
    if (data.phone) {
      const existingPhone = await prisma.teacher.findUnique({
        where: { phone: data.phone },
      });

      if (existingPhone) {
        return { success: false, error: "Phone number already exists" };
      }
    }

    const client = await clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: {
        role: "student",
      },
    });

    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        username: user.id,
        role: "STUDENT",
        displayName: data.name + (data.surname ? ` ${data.surname}` : ""),
      },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        gender: data.gender,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
        userId: user.id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const updateStudent = async (
  currentState: currentState,
  data: StudentInputs
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    if (data.phone) {
      const existingPhone = await prisma.teacher.findUnique({
        where: { phone: data.phone },
      });

      if (existingPhone) {
        return { success: false, error: "Phone number already exists" };
      }
    }

    const client = await clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });
    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        gender: data.gender,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
        userId: user.id,
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const deleteStudent = async (
  currentState: currentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    (await clerkClient()).users.deleteUser(id);
    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

//EXAM ACTIONS

export const createExam = async (
  currentState: currentState,
  data: ExamInputs
) => {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }
    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const updateExam = async (
  currentState: currentState,
  data: ExamInputs
) => {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }
    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });
    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const deleteExam = async (
  currentState: currentState,
  data: FormData
) => {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const id = data.get("id") as string;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

//ASSIGNMENT ACTIONS

export const createAssignment = async (
  currentState: currentState,
  data: AssignmentInputs
) => {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const updateAssignment = async (
  currentState: currentState,
  data: AssignmentInputs
) => {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }
    await prisma.assignment.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });
    // revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const deleteAssignment = async (
  currentState: currentState,
  data: FormData
) => {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const id = data.get("id") as string;

  try {
    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

//LESSON ACTIONS

export const createLesson = async (
  currentState: currentState,
  data: LessonInputs
) => {
  const today = new Date().toISOString().split("T")[0];

  const dateOfStartTime = `${today}T${data.startTime}:00.000Z`;
  const dateOfEndTime = `${today}T${data.endTime}:00.000Z`;

  try {
    await prisma.lesson.create({
      data: {
        name: data.name,
        teacherId: data.teacherId,
        classId: data.classId,
        subjectId: data.subjectId,
        startTime: dateOfStartTime,
        endTime: dateOfEndTime,
        day: data.day,
      },
    });

    // revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const updateLesson = async (
  currentState: currentState,
  data: LessonInputs
) => {
  const today = new Date().toISOString().split("T")[0];

  const dateOfStartTime = `${today}T${data.startTime}:00.000Z`;
  const dateOfEndTime = `${today}T${data.endTime}:00.000Z`;

  try {
    await prisma.lesson.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teacherId: data.teacherId,
        classId: data.classId,
        subjectId: data.subjectId,
        startTime: dateOfStartTime,
        endTime: dateOfEndTime,
        day: data.day,
      },
    });

    // revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const deleteLesson = async (
  currentState: currentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.lesson.delete({
      where: { id: parseInt(id) },
    });

    // revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

//PARENT ACTIONS

export const createParent = async (
  currentState: currentState,
  data: ParentInputs
) => {
  try {
    if (data.phone) {
      const existingPhone = await prisma.teacher.findUnique({
        where: { phone: data.phone },
      });

      if (existingPhone) {
        return { success: false, error: "Phone number already exists" };
      }
    }

    const client = await clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: {
        role: "parent",
      },
    });

    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        username: user.id,
        role: "PARENT",
        displayName: data.name + (data.surname ? ` ${data.surname}` : ""),
      },
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        userId: user.id,
      },
    });

    // revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const updateParent = async (
  currentState: currentState,
  data: ParentInputs
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    if (data.phone) {
      const existingPhone = await prisma.teacher.findUnique({
        where: { phone: data.phone },
      });

      if (existingPhone) {
        return { success: false, error: "Phone number already exists" };
      }
    }

    const client = await clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });
    await prisma.parent.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        userId: user.id,
      },
    });
    // revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const deleteParent = async (
  currentState: currentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    (await clerkClient()).users.deleteUser(id);
    await prisma.parent.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/parent");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

//RESULT ACTIONS

export const createResult = async (
  currentState: currentState,
  data: ResultInputs
) => {
  try {
    await prisma.result.create({
      data: {
        score: data.score,
        examId: data.examId || null,
        assignmentId: data.assignmentId || null,
        studentId: data.studentId,
      },
    });

    // revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const updateResult = async (
  currentState: currentState,
  data: ResultInputs
) => {
  try {
    await prisma.result.update({
      where: { id: data.id },
      data: {
        score: data.score,
        examId: data.examId || null,
        assignmentId: data.assignmentId || null,
        studentId: data.studentId,
      },
    });

    // revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const deleteResult = async (
  currentState: currentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.result.delete({
      where: { id: parseInt(id) },
    });

    // revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

// EVENT ACTIONS

export const createEvent = async (
  currentState: currentState,
  data: EventInputs
) => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data?.classId !== 0 ? data.classId : null,
      },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const updateEvent = async (
  currentState: currentState,
  data: EventInputs
) => {
  try {
    await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data?.classId !== 0 ? data.classId : null,
      },
    });
    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const deleteEvent = async (
  currentState: currentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

//ANNOUNCEMENT ACTIONS

export const createAnnouncement = async (
  currentState: currentState,
  data: AnnouncementInputs
) => {
  try {
    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data?.classId !== 0 ? data.classId : null,
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const updateAnnouncement = async (
  currentState: currentState,
  data: AnnouncementInputs
) => {
  try {
    await prisma.announcement.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data?.classId !== 0 ? data.classId : null,
      },
    });
    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

export const deleteAnnouncement = async (
  currentState: currentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};

// MESSAGE ACTIONS

export const createMessage = async (
  currentState: currentState,
  data: FormData
) => {
  const user = await currentUser();

  const content = data.get("content") as string;
  const receiverId = data.get("receiverId") as string;
  const displayName = data.get("displayName") as string;

  if (content === "" || !receiverId) {
    return { success: false, error: true };
  }
  try {
    await prisma.message.create({
      data: {
        content: content,
        senderId: user?.id!,
        receiverId: receiverId,
        displayName: displayName,
        isRead: false,
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return { success: false, error: true };
    }
    throw error;
  }
};
