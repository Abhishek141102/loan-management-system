import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Basic login check
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user?.isAuthenticated) return <Navigate to="/auth/login" replace />;
  return children;
};

// Module-level access check
export const ModuleRoute = ({ module, children }) => {
  const { user, canView, loadingPermissions } = useAuth();
  if (!user?.isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (loadingPermissions) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh" }}>
        <p style={{ color:"#666" }}>Loading permissions...</p>
      </div>
    );
  }
  if (!canView(module)) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:"12px" }}>
        <div style={{ fontSize:"60px" }}>🚫</div>
        <h2 style={{ color:"#e53e3e", margin:0 }}>Access Denied</h2>
        <p style={{ color:"#666", textAlign:"center" }}>
          Aapke role <strong>({user.role})</strong> ko is module ka access nahi hai.<br/>
          Superadmin se contact karein.
        </p>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;
