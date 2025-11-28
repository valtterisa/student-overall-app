"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sendFeedbackEmail } from "@/lib/send-feedback-email";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export type FeedbackFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export const submitFeedbackAction = async (
  _prevState: FeedbackFormState,
  formData: FormData
): Promise<FeedbackFormState> => {
  const message = formData.get("message")?.toString().trim();
  const type = formData.get("type")?.toString().trim();

  if (!message || message.length < 10 || !type) {
    return {
      status: "error",
      message: "Täytä pakolliset kentät ja kerro hieman tarkemmin.",
    };
  }

  const email = formData.get("email")?.toString().trim() || null;
  const sourceId = formData.get("sourceId")?.toString().trim() || null;
  const sourceName = formData.get("sourceName")?.toString().trim() || null;
  const supabase = await createClient();
  const headerStore = await headers();
  const origin = headerStore.get("origin") || null;
  const referer = headerStore.get("referer") || null;

  const payload = {
    type,
    message,
    email,
    source_id: sourceId,
    source_name: sourceName,
    origin,
    referer,
  };

  const { error } = await supabase.from("feedback_submissions").insert(payload);

  if (error) {
    console.error("Feedback submit failed", error);
    return {
      status: "error",
      message: "Palautteen lähetys epäonnistui, yritä hetken päästä uudelleen.",
    };
  }

  await sendFeedbackEmail({
    type,
    message,
    email,
    sourceId,
    sourceName,
    origin,
    referer,
  });

  return {
    status: "success",
    message: "Kiitos palautteesta!",
  };
};