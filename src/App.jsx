import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/common/Layout";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AdminDashboard from "./pages/admin/AdminDashboard";
import EnquiriesList from "./pages/admin/modules/enquiries/EnquiriesList";
import EnquiryDetails from "./pages/admin/modules/enquiries/EnquiryDetails";
import LoanApplications from "./pages/admin/modules/applications/LoanApplications";
import DocumentList from "./pages/admin/modules/documents/DocumentList";
import ApprovalQueue from "./pages/admin/modules/approval/ApprovalQueue";
import CustomersList from "./pages/admin/modules/customers/CustomersList";
import ReportsPage from "./pages/admin/modules/reports/ReportsPage";
import SettingsPage from "./pages/admin/modules/settings/SettingsPage";
import UserManagement from "./pages/admin/modules/users/UserManagement";

import ProtectedRoute, { ModuleRoute } from "./routes/ProtectedRoute";

const AdminPage = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const ModulePage = ({ module, children }) => (
  <ProtectedRoute>
    <Layout>
      <ModuleRoute module={module}>{children}</ModuleRoute>
    </Layout>
  </ProtectedRoute>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/admin/dashboard" element={<AdminPage><AdminDashboard /></AdminPage>} />

        <Route path="/admin/enquiries"    element={<ModulePage module="enquiries"><EnquiriesList /></ModulePage>} />
        <Route path="/admin/enquiries/:id" element={<ModulePage module="enquiries"><EnquiryDetails /></ModulePage>} />
        <Route path="/admin/applications"  element={<ModulePage module="applications"><LoanApplications /></ModulePage>} />
        <Route path="/admin/documents"     element={<ModulePage module="documents"><DocumentList /></ModulePage>} />
        <Route path="/admin/approval"      element={<ModulePage module="approval"><ApprovalQueue /></ModulePage>} />
        <Route path="/admin/customers"     element={<ModulePage module="customers"><CustomersList /></ModulePage>} />
        <Route path="/admin/reports"       element={<ModulePage module="reports"><ReportsPage /></ModulePage>} />
        <Route path="/admin/settings"      element={<ModulePage module="settings"><SettingsPage /></ModulePage>} />
        <Route path="/admin/users"         element={<ModulePage module="user_management"><UserManagement /></ModulePage>} />

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
