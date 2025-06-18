"use client";

import { useActionState, useState } from "react";
import { signup } from "@/app/actions/auth";
import { SignupFormSchema } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";

// Register Form Component
export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, action, pending] = useActionState(signup, undefined);
  type FormDataType = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validating and updating the field errors on value change.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as {
      name: keyof FormDataType;
      value: string;
    };

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate single field
    const result = SignupFormSchema.safeParse({ ...formData, [name]: value });

    if (!result.success) {
      // console.log(result);
    }
    return result.success;
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden py-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" action={action} noValidate>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                </div>
                {(Object.keys(formData) as Array<keyof FormDataType>).map(
                  (field) => (
                    <div key={field} className="mb-">
                      <Label
                        htmlFor={field}
                        className="text-sm font-medium text-gray-700 pb-2"
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        name={field}
                        type={
                          field.includes("password") ||
                          field.includes("confirmPassword")
                            ? "password"
                            : "text"
                        }
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder={
                          field === "confirmPassword" || field === "password"
                            ? "********"
                            : field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        required
                      />
                      {state?.errors?.[
                        field as keyof typeof state.errors
                      ]?.[0] && (
                        <p className="text-red-500 p-1 text-sm">
                          {
                            state?.errors?.[
                              field as keyof typeof state.errors
                            ]?.[0]
                          }
                        </p>
                      )}
                    </div>
                  )
                )}

                <Button
                  type="submit"
                  disabled={pending}
                  className="font-bold px-5 py-2"
                >
                  {pending ? "Processing..." : "Submit"}
                </Button>
                {state?.message && (
                  <p className="text-green-600 text-center font-semibold pt-2 m-0">
                    {state.message}
                  </p>
                )}
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Sign in
                  </a>
                </div>
              </div>
            </form>
            <div className="relative hidden bg-muted md:block">
              <Image
                src="/login.jpg"
                alt="Image"
                width={500}
                height={500}
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                priority={false}
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </>
  );
}
