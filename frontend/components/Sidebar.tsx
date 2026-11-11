"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "⊞" },
  { label: "Users", href: "/dashboard/users", icon: "👥" },
  { label: "Reports", href: "/dashboard/reports", icon: "📊" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-primary-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-lg">
            F
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">FTS Portal</p>
            <p className="text-xs text-primary-300">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-primary-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin</p>
            <p className="text-xs text-primary-300 truncate">admin@fts.com</p>
          </div>
          <button className="text-primary-300 hover:text-white text-xs transition-colors">
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
