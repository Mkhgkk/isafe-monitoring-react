import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logoBlack.png";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "@/components/form/FormField";
import { useAppwrite } from "../context/AppwriteContext";

interface LoginFormData {
  email: string;
  password: string;
}

function LoginPage() {
  const { account } = useAppwrite();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    try {
      account.get().then((response) => {
        navigate("/");
      });
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      console.log(data);
      const { email, password } = data;
      const session = await account.createEmailPasswordSession(email, password);

      console.log("User logged in:", session);
      navigate("/");
      setSuccess(true);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }

    // localStorage.setItem("token", "1234");
    // navigate("/", { replace: true });
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <Card className="min-w-[400px]">
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
              <Button disabled={loading} className="w-full mt-4" type="submit">
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
