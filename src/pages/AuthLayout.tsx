import LanguageDropdown from "@/components/language-dropdown";
import { cn } from "@/lib/utils";
import { Navigate, Outlet } from "react-router-dom";

function AuthLayout() {
  const token = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  const bgs = [
    'bg-[url("@/assets/bg3.webp")]',
    'bg-[url("@/assets/bg4.webp")]',
    'bg-[url("@/assets/bg6.webp")]',
    'bg-[url("@/assets/bg7.webp")]',
  ];
  const bg = bgs[Math.floor(Math.random() * bgs.length)];

  return token && refreshToken ? (
    <Navigate to="/" />
  ) : (
    <div className="w-screen h-screen relative">
      <div className={cn("absolute inset-0 bg-cover bg-center ", bg)}></div>
      <div className="relative z-10">
        <LanguageDropdown className="absolute bottom-4 left-4" />

        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
