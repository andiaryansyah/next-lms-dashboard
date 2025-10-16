"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { AssignmentInputs, assignmentSchema } from "@/lib/formValidationSchema";
import { createAssignment, updateAssignment } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AssignmentForm = ({
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
  } = useForm<AssignmentInputs>({
    resolver: zodResolver(assignmentSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAssignment : updateAssignment,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    // console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Assignment has been ${
          type === "create" ? "created" : "updated"
        } successfully`
      );
      setOpen(false);
      router.refresh();
    }
  }, [router, setOpen, state, type]);

  const { lessons } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new Assignment"
          : "Update the Assignment"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Imformation
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Assignment Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors.title}
        />
        <InputField
          label="Start Date"
          name="startDate"
          defaultValue={data?.startDate}
          register={register}
          error={errors.startDate}
          type="datetime-local"
        />
        <InputField
          label="Due Date"
          name="dueDate"
          defaultValue={data?.dueDate}
          register={register}
          error={errors.dueDate}
          type="datetime-local"
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
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            {lessons.map((lesson: { id: string; name: string }) => (
              <option value={lesson.id} key={lesson.id}>
                {lesson.name}
              </option>
            ))}
          </select>

          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">{errors.lessonId.message}</p>
          )}
        </div>
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

export default AssignmentForm;
