import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "@/components/form/FormField";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

const loginFormSchema = z.object({
  email: z.string().email("validation.email"),
  password: z.string().min(6, "validation.password"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);

  const { mutate: login, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      navigate("/");
    },
    onError: () => {
      //TODO: handle with code
      setError(t("login.alert.error"));
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
          <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
          <CardDescription>{t("login.desc")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              control={control}
              id="email"
              label={t("profile.email")}
              error={t(errors.email?.message as string)}
              placeholder="email@example.com"
            />
            <FormField
              control={control}
              id="password"
              label={t("profile.password")}
              type="password"
              error={t(errors.password?.message as string)}
            />

            <div>
              {error && (
                <p className="text-sm text-center text-destructive">{error}</p>
              )}
              <Button className="w-full mt-4" type="submit" loading={isPending}>
                {t("login.button")}
              </Button>
              <Button
                className="w-full"
                variant="link"
                onClick={() => navigate("/sign-up")}
              >
                {t("login.orCreate")}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
