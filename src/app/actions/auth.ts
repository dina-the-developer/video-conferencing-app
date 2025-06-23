"use server";
import {
  SignupFormSchema,
  LoginFormSchema,
  FormState,
} from "@/lib/definitions";
import { createSession, destroySession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function signup(state: FormState, formData: FormData) {
  // validate form field using z.
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  // Create a new user in the db with the form data and return the user object.
  const insertUser = await fetch("https://authentication-pi-sand.vercel.app/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }),
  });

  const res = await insertUser.json();
  console.log(res);
  if (!res.success) {
    return {
      message: res.message,
    };
  } else {
    // Create a new session
    await createSession(res.token, res.email, res.name);
    // return { message: res.message };
    redirect("/personal-room");
  }
}

export async function login(state: FormState, formData: FormData) {
  // validate form field using z.
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const checkUser = await fetch("https://authentication-pi-sand.vercel.app/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const res = await checkUser.json();
  if (!res.success) {
    return {
      message: res.message,
    };
  } else {
    // Create a new session
    await createSession(res.token, res.email, res.name);
    redirect("/");
  }
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
