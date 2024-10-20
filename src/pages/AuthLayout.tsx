import { authService } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";

function AuthLayout() {
  // const token = localStorage.getItem("token");
  const { data } = useQuery({
    queryKey: ["authService.getMe"],
    queryFn: authService.getMe,
    retry: 0,
  });

  return data ? (
    <Navigate to="/" />
  ) : (
    <div className="w-screen h-screen bg-[url('@/assets/bg2.jpg')] bg-cover">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
