import { Navigate, Outlet } from "react-router-dom";

function AuthLayout() {
  const token = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  return token && refreshToken ? (
    <Navigate to="/" />
  ) : (
    <div className="w-screen h-screen relative">
      <div className="absolute inset-0 bg-[url('@/assets/bg2.jpg')] bg-cover bg-center blur-lg"></div>
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
