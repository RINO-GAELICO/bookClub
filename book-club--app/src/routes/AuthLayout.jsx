import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div>
      <h1>AuthLayout</h1>
      {/* will either be <Login/> or <Register/> */}
      <Outlet />
    </div>
  );
}