import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PlusCircle,
  Settings,
  User,
  Clock,
  Calendar,
  BarChart,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface PermanentDashboardProps {
  children: React.ReactNode;
}

const PermanentDashboard = ({ children }: PermanentDashboardProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/dashboard", icon: BarChart, label: "Dashboard" },
    { path: "/flows", icon: Clock, label: "My Flows" },
    { path: "/templates", icon: FileText, label: "Templates" },
    { path: "/calendar", icon: Calendar, label: "Calendar" },
    { path: "/analytics", icon: BarChart, label: "Analytics" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Permanent Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center mb-8">
          <img 
            src="/logo.JPG" 
            alt="Flow Logo" 
            className="w-8 h-8 mr-2"
          />
          <h1 className="text-xl font-bold">Flow</h1>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <IconComponent className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>


      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default PermanentDashboard;
