import DashboardMetrics from "../../components/admin/DashboardMetrics";
import Charts from "../../components/admin/Charts";
import QuickActions from "../../components/admin/QuickActions";


function AdminDashboard() {
  const enquiries = [
    { id: "ENQ-101", customer: "Rahul Sharma", loanType: "Home Loan", amount: "₹25,00,000", status: "New" },
    { id: "ENQ-102", customer: "Sneha Patil", loanType: "Personal Loan", amount: "₹3,50,000", status: "In Progress" },
    { id: "ENQ-103", customer: "Amit Jadhav", loanType: "Vehicle Loan", amount: "₹8,00,000", status: "Converted" },
  ];

  const approvals = [
    { loanId: "LOAN-501", applicant: "Priya Deshmukh", docs: "Verified", cibil: "742", action: "Review" },
    { loanId: "LOAN-502", applicant: "Kunal Patil", docs: "Verified", cibil: "718", action: "Review" },
  ];

  return (
    <div className="page-container dashboard-page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Finance & Trust Dashboard</p>
          <h2>I Loan Admin Dashboard</h2>
          <p>Manage enquiries, applications, document verification and loan approvals from one place.</p>
        </div>
      </div>

      <DashboardMetrics />
      <Charts />
      <QuickActions />

   
    </div>
  );
}

export default AdminDashboard;
