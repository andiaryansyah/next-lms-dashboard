export function getClientScheme() {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("scheme="));

  return match ? match.split("=")[1] : "light";
}

export function toggleScheme() {
  const current = getClientScheme();
  const next = current === "dark" ? "light" : "dark";

  // update cookie
  document.cookie = `scheme=${next}; path=/;`;

  // instant UI update
  if (next === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return next;
}
