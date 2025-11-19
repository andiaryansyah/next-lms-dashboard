export const getCurrentScheme = async () => {
  // SERVER SIDE
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const scheme = cookies().get("scheme")?.value;
    return scheme || "light";
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
