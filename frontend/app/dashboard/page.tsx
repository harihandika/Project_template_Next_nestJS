const stats = [
  { label: "Total Users", value: "1,284", change: "+12%", up: true, icon: "👥", color: "bg-blue-500" },
  { label: "Active Sessions", value: "342", change: "+5%", up: true, icon: "🟢", color: "bg-green-500" },
  { label: "Reports Today", value: "48", change: "-3%", up: false, icon: "📊", color: "bg-purple-500" },
  { label: "System Health", value: "99.9%", change: "Stable", up: true, icon: "🛡️", color: "bg-orange-500" },
];

const recentUsers = [
  { name: "Ahmad Fauzi", email: "ahmad@fts.com", role: "Admin", status: "Active", joined: "May 10, 2026" },
  { name: "Siti Rahayu", email: "siti@fts.com", role: "User", status: "Active", joined: "May 9, 2026" },
  { name: "Budi Santoso", email: "budi@fts.com", role: "User", status: "Inactive", joined: "May 8, 2026" },
  { name: "Dewi Lestari", email: "dewi@fts.com", role: "Manager", status: "Active", joined: "May 7, 2026" },
  { name: "Rizky Pratama", email: "rizky@fts.com", role: "User", status: "Active", joined: "May 6, 2026" },
];

const activities = [
  { action: "New user registered", time: "2 min ago", icon: "👤" },
  { action: "Report generated", time: "15 min ago", icon: "📄" },
  { action: "Settings updated", time: "1 hour ago", icon: "⚙️" },
  { action: "Backup completed", time: "3 hours ago", icon: "💾" },
  { action: "System maintenance", time: "Yesterday", icon: "🔧" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-lg`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Users Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Recent Users</h3>
            <button className="text-sm text-primary-600 hover:underline font-medium">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{user.role}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  {activity.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
