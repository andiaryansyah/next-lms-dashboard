import { cookies } from "next/headers";

export function getServerScheme() {
  const cookieStore = cookies();
  return cookieStore.get("scheme")?.value ?? "light";
}
