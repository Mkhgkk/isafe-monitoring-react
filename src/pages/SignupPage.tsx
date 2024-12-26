import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useTranslation } from "react-i18next";
import { buttonClassName, inputClassName } from "./LoginPage";

//TODO: validation localization
const signUpSchema = z
  .object({
    username: z.string().min(3, "validation.username"),
    email: z.string().email("validation.email"),
    password: z.string().min(6, "validation.password"),
    passwordConfirm: z.string(),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        path: ["passwordConfirm"],
        message: "validation.passwordNotMatch",
        code: "custom",
      });
    }
  });

export type SignupFormData = z.infer<typeof signUpSchema>;

function SignupPage() {
  const { t } = useTranslation();
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
        title: t("signUp.alert.success"),
      });
      navigate("/login");
    },
    onError: (e) => {
      console.log(e);
      //handle case where user already exists
      toast({
        variant: "destructive",
        title: t("signUp.alert.error"),
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
      <Card className="min-w-[400px] bg-transparent border-0">
        <CardHeader className="space-y-1">
          <div className="flex gap-3 justify-center">
            <img src={logo} width={30} height={30} />
            <CardTitle className="text-2xl dark:text-white text-white">
              {t("app")}
            </CardTitle>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-3">
            <FormField
              control={control}
              id="username"
              placeholder={t("profile.username")}
              error={t(errors.username?.message as string)}
              inputClassName={inputClassName}
            />
            <FormField
              control={control}
              id="email"
              placeholder={t("profile.email")}
              error={t(errors.email?.message as string)}
              inputClassName={inputClassName}
            />
            <FormField
              control={control}
              id="password"
              placeholder={t("profile.password")}
              type="password"
              error={t(errors.password?.message as string)}
              inputClassName={inputClassName}
            />
            <FormField
              control={control}
              id="passwordConfirm"
              placeholder={t("profile.confirmPassword")}
              type="password"
              error={t(errors.passwordConfirm?.message as string)}
              inputClassName={inputClassName}
            />

            <div>
              <Button loading={isPending} className={buttonClassName}>
                {t("signUp.button")}
              </Button>
              <Button
                className="w-full text-white"
                variant="link"
                onClick={() => navigate("/login")}
              >
                {t("signUp.orLogin")}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

export default SignupPage;
