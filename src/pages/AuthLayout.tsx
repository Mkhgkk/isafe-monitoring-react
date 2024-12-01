import { Navigate, Outlet } from "react-router-dom";

function AuthLayout() {
  const token = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  return token && refreshToken ? (
    <Navigate to="/" />
  ) : (
    <div className="w-screen h-screen bg-[url('@/assets/bg2.jpg')] bg-cover">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
