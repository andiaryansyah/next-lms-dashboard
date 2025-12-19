"use client";

import { createMessage } from "@/lib/server/actions";
import { MessageInputs, messageSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MessageForm = ({
  receiverId,
  senderName,
  currentUserId,
}: {
  receiverId: string | null;
  senderName: string | null;
  currentUserId: string | null;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<MessageInputs>({
    resolver: zodResolver(messageSchema),
  });

  const router = useRouter();

  const [state, formAction] = useFormState(createMessage, {
    success: false,
    error: false,
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("content", data?.content || "");
    formData.append("receiverId", receiverId || "");
    formData.append("displayName", senderName || "");
    resetField("content");
    formAction(formData);
    // console.log(data?.content, receiverId, senderName, currentUserId);
    router.refresh();
  });

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state]);

  return (
    <form className="flex gap-4" onSubmit={onSubmit}>
      <div className="flex-grow">
        <div className="flex-grow">
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <input
            className="w-full rounded border-black/20 p-2 dark:bg-gray-800"
            {...register("content")}
            id="content"
            name="content"
            type="text"
          />
        </div>

        <InputField
          label="Id"
          name="id"
          register={register}
          error={errors.id}
          hidden
        />
      </div>

      <div>
        <button
          className="h-full px-2 py-0.5 bg-blue-500 hover:bg-blue-700 text-white font-medium transition rounded shadow"
          type="submit"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageForm;
