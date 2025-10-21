"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { ResultInputs, resultSchema } from "@/lib/formValidationSchema";
import { createResult, updateResult } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ExamForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  relatedData?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<ResultInputs>({
    resolver: zodResolver(resultSchema),
  });

  type ClassType = {
    id: number;
    name: string;
  };

  type StudentType = {
    id: string;
    name: string;
    class: ClassType[];
  };

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  const router = useRouter();

  const { students, exams, assignments } = relatedData;

  const [title, setTitle] = useState("exam");
  const [selectedExamId, setSelectedExamId] = useState(exams[0].id || 0);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(
    assignments[0].id || 0
  );

  const getClassId =
    title === "exam"
      ? exams.find((classId: { id: Number }) => classId.id === selectedExamId)
          ?.lesson.classId
      : assignments.find(
          (classId: { id: Number }) => classId.id === selectedAssignmentId
        )?.lesson.classId;

  const filteredStudents: StudentType[] = getClassId
    ? students.filter(
        (student: { class: { id: number } }) =>
          student.class.id === Number(getClassId)
      )
    : [];

  // console.log("exam datas: " + JSON.stringify(exams, null, 2));
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTitle(e.target.value);
    resetField("examId");
    resetField("assignmentId");
  };

  const handleChangeAssignmentId = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedAssignmentId(parseInt(e.target.value));
  };

  const handleChangeExamId = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExamId(parseInt(e.target.value));
  };

  useEffect(() => {
    if (state.success) {
      toast(
        `Result has been ${
          type === "create" ? "created" : "updated"
        } successfully`
      );
      setOpen(false);
      router.refresh();
    }
  }, [router, setOpen, state, type, title]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold dark:text-zinc-100">
        {type === "create" ? "Create a new Result" : "Update the Result"}
      </h1>
      <span className="text-xs text-gray-400 font-medium dark:text-zinc-100">
        Authentication Imformation
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors.id}
            hidden
          />
        )}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Title</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none dark:text-zinc-100 dark:bg-gray-800"
            defaultValue={title}
            onChange={handleChange}
          >
            <option value="exam">Exam</option>
            <option value="assignment">Assignment</option>
          </select>
        </div>

        {title === "exam" && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Choose {title}</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none dark:text-zinc-100 dark:bg-gray-800"
              {...register("examId")}
              defaultValue={data?.examId}
              onChange={handleChangeExamId}
            >
              {exams.map((exam: { id: string; title: string }) => (
                <option value={exam.id} key={exam.id}>
                  {exam.title}
                </option>
              ))}
            </select>

            {errors.examId?.message && (
              <p className="text-xs text-red-400">{errors.examId.message}</p>
            )}
          </div>
        )}
        {title === "assignment" && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Choose {title}</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none dark:text-zinc-100 dark:bg-gray-800"
              {...register("assignmentId")}
              defaultValue={data?.assignmentId}
              onChange={handleChangeAssignmentId}
            >
              {assignments.map((assignment: { id: string; title: string }) => (
                <option value={assignment.id} key={assignment.id}>
                  {assignment.title}
                </option>
              ))}
            </select>

            {errors.assignmentId?.message && (
              <p className="text-xs text-red-400">
                {errors.assignmentId.message}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none dark:text-zinc-100 dark:bg-gray-800"
            {...register("studentId")}
            defaultValue={data?.studentId}
          >
            {filteredStudents.map((student: { id: string; name: string }) => (
              <option value={student.id} key={student.id}>
                {student.name}
              </option>
            ))}
          </select>

          {errors.studentId?.message && (
            <p className="text-xs text-red-400">{errors.studentId.message}</p>
          )}
        </div>

        <InputField
          label="Score"
          name="score"
          defaultValue={data?.score}
          register={register}
          error={errors.score}
        />
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ExamForm;
