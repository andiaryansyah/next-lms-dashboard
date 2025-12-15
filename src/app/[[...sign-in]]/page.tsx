"use client";

import { useUser } from "@clerk/nextjs";
import * as SignIn from "@clerk/elements/sign-in";
import * as Clerk from "@clerk/elements/common";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const role = user?.publicMetadata?.role;
    if (role) router.push(`/${role}`);
  }, [isLoaded, user, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-pickSkyLight dark:bg-gray-800">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white dark:bg-gray-900 p-12 rounded-md shadow-2xl flex flex-col gap-4 min-w-[350px]"
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={24} height={24} />
            School Management Systems
          </h1>

          <p className="text-gray-400 dark:text-zinc-100 text-sm">
            Sign in to your account
          </p>

          {/* Global Error */}
          <Clerk.GlobalError className="text-red-400 text-sm" />

          {/* Username Field */}
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500 dark:text-zinc-300">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              className="p-2 rounded-md ring-1 ring-gray-300 dark:bg-gray-800"
              required
            />
            <Clerk.FieldError className="text-red-400 text-sm" />
          </Clerk.Field>

          {/* Password Field */}
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500 dark:text-zinc-300">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              className="p-2 rounded-md ring-1 ring-gray-300 dark:bg-gray-800"
              required
            />
            <Clerk.FieldError className="text-red-400 text-sm" />
          </Clerk.Field>

          {/* Submit Button */}
          <SignIn.Action
            submit
            className="bg-blue-500 text-white mt-2 rounded-md text-sm p-[10px] hover:bg-blue-600 transition"
          >
            Sign in
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}
