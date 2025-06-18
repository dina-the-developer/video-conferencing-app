"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { login } from "@/app/actions/auth";
import { useActionState, useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, action, pending] = useActionState(login, undefined);
  type FormDataType = {
    email: string;
    password: string;
  };
  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",
  });

  // Validating and updating the field errors on value change.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as {
      name: keyof FormDataType;
      value: string;
    };

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" action={action} noValidate>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="
                  shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  name="email"
                  placeholder="john@example.com"
                />
                {state?.errors?.email && (
                  <p className="text-red-500 p-1 text-sm m-0">
                    {state?.errors?.email[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  type="password"
                  onChange={handleChange}
                  value={formData.password}
                  name="password"
                  placeholder="********"
                />
                {state?.errors?.password && (
                  <p className="text-red-500 p-1 text-sm m-0">
                    {state?.errors?.password[0]}
                  </p>
                )}
              </div>
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
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Sign up
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
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
