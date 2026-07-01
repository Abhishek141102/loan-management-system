import { FaCheckCircle, FaClipboardList, FaEnvelopeOpenText, FaFileSignature } from "react-icons/fa";
import StatCard from "./StatCard";

function DashboardMetrics() {
  return (
    <div className="metrics-grid">
      <StatCard title="Total Enquiries" value="128" trend="+14% this month" icon={<FaEnvelopeOpenText />} />
      <StatCard title="Active Applications" value="64" trend="Under process" icon={<FaFileSignature />} />
      <StatCard title="Pending Documents" value="21" trend="Needs action" icon={<FaClipboardList />} />
      <StatCard title="Approved Today" value="07" trend="Ready for sanction" icon={<FaCheckCircle />} />
    </div>
  );
}

export default DashboardMetrics;
