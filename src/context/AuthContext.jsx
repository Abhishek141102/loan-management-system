import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]                       = useState(null);
  const [token, setToken]                     = useState(localStorage.getItem("token"));
  const [permissions, setPermissions]         = useState({});
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    if (token) {
      const role  = localStorage.getItem("adminRole")  || "admin";
      const name  = localStorage.getItem("adminName")  || "Admin";
      const email = localStorage.getItem("adminEmail") || "";
      setUser({ isAuthenticated: true, name, email, role });
      fetchPermissions(token);
    }
  }, [token]);

  const fetchPermissions = async (jwt) => {
    try {
      setLoadingPermissions(true);
      const res = await axios.get("http://localhost:5000/api/auth/my-permissions", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const permsMap = {};
      res.data.permissions.forEach((p) => {
        permsMap[p.module] = {
          can_view:   p.can_view,
          can_create: p.can_create,
          can_edit:   p.can_edit,
          can_delete: p.can_delete,
        };
      });
      setPermissions(permsMap);
      return permsMap;
    } catch (err) {
      console.error("Permission load failed:", err);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const login = (jwtToken, adminData) => {
    localStorage.setItem("token",      jwtToken);
    localStorage.setItem("adminName",  adminData.name);
    localStorage.setItem("adminEmail", adminData.email);
    localStorage.setItem("adminRole",  adminData.role);
    setToken(jwtToken);
    setUser({ isAuthenticated: true, name: adminData.name, email: adminData.email, role: adminData.role });
    fetchPermissions(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminRole");
    setToken(null);
    setUser(null);
    setPermissions({});
  };

  const canView   = (module) => { if (user?.role === "superadmin") return true; return permissions[module]?.can_view   === 1; };
  const canCreate = (module) => { if (user?.role === "superadmin") return true; return permissions[module]?.can_create === 1; };
  const canEdit   = (module) => { if (user?.role === "superadmin") return true; return permissions[module]?.can_edit   === 1; };
  const canDelete = (module) => { if (user?.role === "superadmin") return true; return permissions[module]?.can_delete === 1; };

  return (
    <AuthContext.Provider value={{
      user, token, permissions, loadingPermissions,
      login, logout, fetchPermissions,
      canView, canCreate, canEdit, canDelete,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
