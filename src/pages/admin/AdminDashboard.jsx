import { Link } from "react-router-dom";
import { Users, Briefcase, FileCheck, Activity } from "lucide-react";
import Card from "../../components/common/Card.jsx";

function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "1,247", icon: Users, color: "text-accent" },
    { label: "Total Jobs", value: "342", icon: Briefcase, color: "text-success" },
    { label: "Applications", value: "5,891", icon: FileCheck, color: "text-warning" },
    { label: "Active Today", value: "89", icon: Activity, color: "text-danger" },
  ];

  const activities = [
    { action: "New user registered", time: "2 min ago" },
    { action: "Job posted: Frontend Developer at TechCorp", time: "15 min ago" },
    { action: "Application submitted for Backend Dev", time: "1 hour ago" },
    { action: "User upgraded to Pro plan", time: "3 hours ago" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
              </div>
              <s.icon size={24} className={s.color} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex justify-between text-sm border-b border-white/5 pb-2">
                <span className="text-gray-300">{a.action}</span>
                <span className="text-gray-500">{a.time}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/admin/jobs" className="block rounded-lg bg-white/5 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition">Manage Jobs →</Link>
            <Link to="/admin/users" className="block rounded-lg bg-white/5 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition">Manage Users →</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
