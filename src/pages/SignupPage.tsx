import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import logo from "@/assets/logoBlack.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "@/components/form/FormField";

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

function SignupPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const onSubmit: SubmitHandler<SignupFormData> = (data) => {
    console.log(data); // Handle form submission
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <Card className="min-w-[500px]">
        <CardHeader className="space-y-1">
          <img src={logo} width={30} height={30} className="mb-2" />
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              id="usernmae"
              label="Username"
              register={register}
              error={errors.username?.message as string}
              required
              placeholder="John Doe"
              requiredMark={false}
            />
            <FormField
              id="email"
              label="Email"
              register={register}
              error={errors.email?.message as string}
              required
              placeholder="m@example.com"
              requiredMark={false}
              validate={(val: string) => {
                if (!/^\S+@\S+$/i.test(val)) return "Invalid email address";
              }}
            />
            <FormField
              id="password"
              label="Password"
              type="password"
              register={register}
              error={errors.password?.message as string}
              required
              requiredMark={false}
              validate={(val: string) => {
                if (val.length < 8) {
                  return "Password must be at least 8 characters";
                }
              }}
            />
            <FormField
              id="passwordConfirm"
              label="Password Confirmation"
              type="password"
              register={register}
              error={errors.passwordConfirm?.message as string}
              required
              requiredMark={false}
              validate={(val: string) => {
                if (watch("password") != val) {
                  return "Your passwords do no match";
                }
              }}
            />

            <div>
              <Button className="w-full mt-4">Create account</Button>
              <Button
                className="w-full"
                variant="link"
                onClick={() => navigate("/login")}
              >
                Or login
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

export default SignupPage;
