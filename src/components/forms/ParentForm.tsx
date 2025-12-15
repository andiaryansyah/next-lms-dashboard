"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ParentInputs, parentSchema } from "@/lib/formValidationSchema";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createParent, updateParent } from "@/lib/actions";
import { toast } from "react-toastify";

const ParentForm = ({
  type,
  data,
  relatedData,
  setOpen,
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
  } = useForm<ParentInputs>({
    resolver: zodResolver(parentSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createParent : updateParent,
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
        `Parent has been ${
          type === "create" ? "created" : "updated"
        } successfully`
      );
      setOpen(false);
      router.refresh();
    }
  }, [router, setOpen, state, type]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold dark:text-zinc-100">
        {type === "create" ? "Create a new parent" : "Update the parent"}
      </h1>
      <span className="text-xs text-gray-400 font-medium dark:text-zinc-100">
        Authentication Imformation
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors.username}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={data?.email}
          register={register}
          error={errors.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium dark:text-zinc-100">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
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
      </div>

      {/* {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )} */}
      <button className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ParentForm;
