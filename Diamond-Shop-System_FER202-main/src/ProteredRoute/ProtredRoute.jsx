import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth";

const ProtectedRoute = ({ roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Nếu không có người dùng, chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }
  // Nếu người dùng có quyền truy cập, hiển thị component yêu cầu
  return <Outlet />;
};

export default ProtectedRoute;
