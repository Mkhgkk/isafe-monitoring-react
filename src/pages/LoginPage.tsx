import { Button } from "@/components/ui/button";
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
    reset,
  } = useForm();

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    console.log(data);

    localStorage.setItem("token", "1234");
    navigate("/", { replace: true });
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
              <Button className="w-full mt-4" type="submit">
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