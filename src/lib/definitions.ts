import { z } from "zod";

export const SignupFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name is mandatory." }).trim(),
    email: z
      .string()
      .email({ message: "Enter valid email address." })
      .min(2, { message: "Email is mandatory" })
      .trim(),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long." })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Please confirm your password.",
      })
      .min(2, { message: "Password is mandatory" })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password field must not be empty." }),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  id: string;
  username?: string;
  email?: string;
  expiresAt: Date;
};
