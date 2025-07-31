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
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/", icon: BarChart, label: "Dashboard" },
    { path: "/workflows", icon: Clock, label: "My Workflows" },
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
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center mr-2">
            <span className="text-primary-foreground font-bold">F</span>
          </div>
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

        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center px-3 py-2">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">User Name</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default PermanentDashboard;
