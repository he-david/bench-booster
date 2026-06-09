"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid username or password." };
    }
    throw error;
  }

  // Re-render the root layout so its server-side `auth()` picks up the new
  // session cookie and NavBar renders. Shared layouts are not re-rendered on
  // client navigation, so without this the navbar stays hidden until refresh.
  revalidatePath("/", "layout");
  redirect("/questions");
}
