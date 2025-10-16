import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()),
});

export type SubjectInputs = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject Name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassInputs = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username at least 3 characters long!" })
    .max(20, { message: "Username at most 20 characters long!" }),
  email: z
    .string()
    .email({ message: "Invaled email address !" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().optional(),
  address: z.string(),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),
  img: z.string().optional(),
  subjects: z.array(z.string()).optional(),
});

export type TeacherInputs = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username at least 3 characters long!" })
    .max(20, { message: "Username at most 20 characters long!" }),
  email: z
    .string()
    .email({ message: "Invaled email address !" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().optional(),
  address: z.string(),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),
  img: z.string().optional(),
  gradeId: z.coerce.number().min(1, { message: "Grade Id is required" }),
  classId: z.coerce.number().min(1, { message: "Class Id is required" }),
  parentId: z.string().min(1, { message: "Parent Id is required" }),
});

export type StudentInputs = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required" }),
  endTime: z.coerce.date({ message: "End time is required" }),
  lessonId: z.coerce.number({ message: "Lesson is required" }),
});

export type ExamInputs = z.infer<typeof examSchema>;

export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startDate: z.coerce.date({ message: "Start time is required" }),
  dueDate: z.coerce.date({ message: "End time is required" }),
  lessonId: z.coerce.number({ message: "Lesson is required" }),
});

export type AssignmentInputs = z.infer<typeof assignmentSchema>;

export const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  subjectId: z.coerce.number(),
  teacherId: z.coerce.string(),
  classId: z.coerce.number().min(1, { message: "Class Id is required" }),
  name: z.string().min(1, { message: "Subject name is required!" }),
  // startTime: z.coerce.date({ message: "Start time is required" }),
  startTime: z.coerce.string({ message: "Start time is required" }),
  // endTime: z.coerce.date({ message: "End time is required" }),
  endTime: z.coerce.string({ message: "End time is required" }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
    message: "Day is required",
  }),
});

export type LessonInputs = z.infer<typeof lessonSchema>;

export const parentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username at least 3 characters long!" })
    .max(20, { message: "Username at most 20 characters long!" }),
  email: z
    .string()
    .email({ message: "Invaled email address !" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string(),
  address: z.string(),
});

export type ParentInputs = z.infer<typeof parentSchema>;

export const eventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  startTime: z.coerce.date({ message: "Start time is required" }),
  endTime: z.coerce.date({ message: "End time is required" }),
  classId: z.coerce.number().optional(),
});
export type EventInputs = z.infer<typeof eventSchema>;

export const announcementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  date: z.coerce.date({ message: "Date is required" }),
  classId: z.coerce.number().optional(),
});
export type AnnouncementInputs = z.infer<typeof announcementSchema>;

export const resultSchema = z.object({
  id: z.coerce.number().optional(),
  score: z.coerce.number().min(1, { message: "Score is required!" }),
  examId: z.coerce.number().optional(),
  assignmentId: z.coerce.number().optional(),
  studentId: z.coerce.string(),
});
export type ResultInputs = z.infer<typeof resultSchema>;

export const messageSchema = z.object({
  id: z.coerce.number().optional(),
  content: z.coerce.string().optional(),
});
export type MessageInputs = z.infer<typeof messageSchema>;
