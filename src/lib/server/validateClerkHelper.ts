import { clerkClient } from "@clerk/nextjs/server";

type ValidateClerkUniqueArgs = {
  userId?: string;
  username?: string;
  email?: string;
  parentId?: string;
};

export const validateClerkHelper = async ({
  userId,
  username,
  email,
  parentId,
}: ValidateClerkUniqueArgs) => {
  const client = await clerkClient();

  const fieldErrors: Record<string, string> = {};

  if (username) {
    const users = await client.users.getUserList({
      username: [username],
    });

    const conflict = users.data.find(
      (user) => user.username === username && user.id !== userId
    );

    if (conflict) {
      fieldErrors.username = "Username already exists";
    }
  }

  if (email) {
    const users = await client.users.getUserList({
      emailAddress: [email],
    });

    const conflict = users.data.find(
      (user) =>
        user.emailAddresses?.[0]?.emailAddress === email && user.id !== userId
    );

    if (conflict) {
      fieldErrors.email = "Email already exists";
    }
  }

  if (parentId) {
    const users = await client.users.getUserList({
      userId: [parentId],
    });

    if (!users.data.length) {
      fieldErrors.parentId = "ParentId does not exist";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      isValid: false,
      fieldErrors,
    };
  }

  return { isValid: true };
};
