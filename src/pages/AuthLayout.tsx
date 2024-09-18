import { Navigate, Outlet } from "react-router-dom";

function AuthLayout() {
  const token = localStorage.getItem("token");

  return token ? (
    <Navigate to="/" />
  ) : (
    <div className="w-screen h-screen bg-[url('@/assets/bg.jpg')] bg-cover">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
