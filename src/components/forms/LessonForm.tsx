"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LessonInputs, lessonSchema } from "@/lib/formValidationSchema";
import { createLesson, updateLesson } from "@/lib/actions";

const LessonForm = ({
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
  } = useForm<LessonInputs>({
    resolver: zodResolver(lessonSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createLesson : updateLesson,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Lesson has been ${
          type === "create" ? "created" : "updated"
        } successfully`
      );
      setOpen(false);
      router.refresh();
    }
  }, [router, setOpen, state, type]);

  const { teachers, classes, subjects } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Lesson" : "Update the Lesson"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Imformation
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Lesson Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
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
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none"
            {...register("subjectId")}
            defaultValue={data?.subjects}
          >
            {subjects.map((subject: { id: string; name: string }) => (
              <option
                value={subject.id}
                key={subject.id}
                selected={data && subject.id === data.subjectId}
              >
                {subject.name}
              </option>
            ))}
          </select>

          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">{errors.subjectId.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none"
            {...register("day")}
            defaultValue={data?.day}
          >
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
          </select>

          {errors.day?.message && (
            <p className="text-xs text-red-400">{errors.day.message}</p>
          )}
        </div>
        <InputField
          label="Start Time"
          name="startTime"
          // defaultValue={data?.startTime}
          defaultValue={
            data?.startTime
              ? new Date(data.startTime).toISOString().substring(11, 19)
              : ""
          }
          register={register}
          error={errors.startTime}
          type="time"
        />
        <InputField
          label="End Time"
          name="endTime"
          // defaultValue={data?.endTime}
          defaultValue={
            data?.endTime
              ? new Date(data.endTime).toISOString().substring(11, 19)
              : ""
          }
          register={register}
          error={errors.endTime}
          type="time"
          // type="datetime-local"
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none"
            {...register("classId")}
            defaultValue={data?.classes}
          >
            {classes.map((classItem: { id: string; name: string }) => (
              <option
                value={classItem.id}
                key={classItem.id}
                selected={data && classItem.id === data.classItemId}
              >
                {classItem.name}
              </option>
            ))}
          </select>

          {errors.classId?.message && (
            <p className="text-xs text-red-400">{errors.classId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none"
            {...register("teacherId")}
            defaultValue={data?.teachers}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option
                  value={teacher.id}
                  key={teacher.id}
                  selected={data && teacher.id === data.teacherId}
                >
                  {teacher.name + " " + teacher.surname}
                </option>
              )
            )}
          </select>

          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">{errors.teacherId.message}</p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default LessonForm;
