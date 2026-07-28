import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getProfile } from "../redux/features/auth/authThunk";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated, token]);

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#FAF6F0] text-[#3D271B] font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#B0652F] mb-4"></div>
        <p className="text-sm font-semibold tracking-wider">Verifying Session Credentials...</p>
      </div>
    );
  }

  if (error && !token) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
