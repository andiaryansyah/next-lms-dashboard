import { cookies } from "next/headers";

export const getCurrentScheme = async () => {
  // Server side
  if (typeof window === "undefined") {
    const cookieStore = await cookies();

    const scheme = cookieStore.get("scheme")?.value;
    return scheme ?? "light";
  }

  // CLIENT SIDE
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("scheme="));
  return match ? match.split("=")[1] : "light";
};

export const toggleScheme = async () => {
  const scheme = await getCurrentScheme();
  const newScheme = scheme === "dark" ? "light" : "dark";

  // update cookie
  document.cookie = `scheme=${newScheme}; path=/;`;

  // INSTANT UPDATE DI CLIENT
  if (newScheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return newScheme;
};
