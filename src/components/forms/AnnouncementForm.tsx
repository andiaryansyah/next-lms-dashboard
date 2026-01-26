"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  AnnouncementInputs,
  announcementSchema,
} from "@/lib/formValidationSchema";
import { createAnnouncement, updateAnnouncement } from "@/lib/server/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AnnouncementForm = ({
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
  } = useForm<AnnouncementInputs>({
    resolver: zodResolver(announcementSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [state, formAction] = useFormState(
    type === "create" ? createAnnouncement : updateAnnouncement,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
    // console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success || state.error) {
      setIsLoading(false);
    }
    if (state.success) {
      toast(
        `Announcement has been ${
          type === "create" ? "created" : "updated"
        } successfully`
      );
      setOpen(false);
      router.refresh();
    }
  }, [router, setOpen, state, type]);

  const { classes } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold dark:text-zinc-100">
        {type === "create"
          ? "Create a new Announcement"
          : "Update the Announcement"}
      </h1>
      <span className="text-xs text-gray-400 font-medium dark:text-zinc-100">
        Authentication Imformation
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Announcement Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors.title}
        />

        <InputField
          label="Date"
          name="date"
          defaultValue={data?.date}
          register={register}
          error={errors.date}
          type="date"
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
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-green-500 outline-none dark:text-zinc-100 dark:bg-gray-800"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            <option value={0}>All</option>
            {classes.map((classItem: { id: string; name: string }) => (
              <option value={classItem.id} key={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>

          {errors.classId?.message && (
            <p className="text-xs text-red-400">{errors.classId.message}</p>
          )}
        </div>
      </div>

      <InputField
        label="Description"
        name="description"
        defaultValue={data?.description}
        register={register}
        error={errors.description}
        textarea={true}
        rows={4}
        placeholder="Type your description..."
      />

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button
        className={`bg-blue-400 text-white p-2 rounded-md ${
          isLoading ? "bg-gray-400" : "hover:bg-blue-500"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AnnouncementForm;
