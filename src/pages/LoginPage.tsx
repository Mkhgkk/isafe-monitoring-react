import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import logo from "@/assets/logoBlack.png";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "@/components/form/FormField";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/api";

interface LoginFormData {
  email: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);

  const { mutate: login, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      navigate("/");
    },
    onError: (err) => {
      setError(err.message || "Invalid credentials. Please try again.");
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setError(null);
    login(data);
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <Card className="min-w-[400px] max-w-[400px]">
        <CardHeader className="space-y-1">
          <img src={logo} width={30} height={30} className="mb-2" />
          <CardTitle className="text-2xl">Welcome to iSafe-guard</CardTitle>
          <CardDescription>
            Enter your email below to login your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              id="email"
              label="Email"
              register={register}
              error={errors.email?.message as string}
              required
              placeholder="m@example.com"
              requiredMark={false}
            />
            <FormField
              id="password"
              label="Password"
              type="password"
              register={register}
              error={errors.password?.message as string}
              required
              requiredMark={false}
            />

            <div>
              {error && (
                <p className="text-sm text-center text-destructive">{error}</p>
              )}
              <Button
                disabled={isPending}
                className="w-full mt-4"
                type="submit"
              >
                Login
              </Button>
              <Button
                className="w-full"
                variant="link"
                onClick={() => navigate("/sign-up")}
              >
                Or Create account
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
