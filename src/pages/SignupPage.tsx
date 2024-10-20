import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import logo from "@/assets/logo.png";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "@/components/form/FormField";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirm: z.string(),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        path: ["passwordConfirm"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });

export type SignupFormData = z.infer<typeof signUpSchema>;

function SignupPage() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { mutate: createAccount, isPending } = useMutation({
    mutationFn: authService.createAccount,
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Signup Successful",
        description: "You can now login into your account!",
      });
      navigate("/login");
    },
    onError: (e) => {
      console.log(e);
      //handle case where user already exists
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    const { email, password, username } = data;
    createAccount({ email, password, username });
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
              control={control}
              id="username"
              label="Username"
              error={errors.username?.message as string}
              placeholder="John Doe"
            />
            <FormField
              control={control}
              id="email"
              label="Email"
              error={errors.email?.message as string}
              placeholder="m@example.com"
            />
            <FormField
              control={control}
              id="password"
              label="Password"
              type="password"
              error={errors.password?.message as string}
            />
            <FormField
              control={control}
              id="passwordConfirm"
              label="Password Confirmation"
              type="password"
              error={errors.passwordConfirm?.message as string}
            />

            <div>
              <Button loading={isPending} className="w-full mt-4">
                Create account
              </Button>
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
