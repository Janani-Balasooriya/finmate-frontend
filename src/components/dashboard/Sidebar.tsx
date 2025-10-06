import { cn } from "@/lib/utils";
import { LayoutDashboard, TrendingUp, TrendingDown, PieChart, Target, CreditCard, Settings, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const menuItems = [{
  icon: LayoutDashboard,
  label: "Dashboard",
  path: "/"
}, {
  icon: TrendingUp,
  label: "Income",
  path: "/income"
}, {
  icon: TrendingDown,
  label: "Expenses",
  path: "/expenses"
}, {
  icon: PieChart,
  label: "Budgets",
  path: "/budgets"
}, {
  icon: Target,
  label: "Shared Goals",
  path: "/shared-goals"
}, {
  icon: CreditCard,
  label: "Subscriptions",
  path: "/subscriptions"
}, {
  icon: Settings,
  label: "Settings",
  path: "/settings/profile"
}];
interface SidebarProps {
  currentPage?: string;
}
export function Sidebar({
  currentPage
}: SidebarProps) {
  const location = useLocation();
  return <div className="w-64 h-screen bg-sidebar fixed left-0 top-0 z-10 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-emerald-400">FinMate</h1>
      </div>
      
      <nav className="px-4">
        <p className="text-sm text-sidebar-foreground/60 px-3 py-2 font-medium uppercase tracking-wide">Menu</p>
        <div className="space-y-2 mt-4">
          {menuItems.filter(item => item.label !== "Settings").map(item => {
          const isActive = location.pathname === item.path ||
                          (item.path === "/settings/profile" && location.pathname.startsWith("/settings"));
          return <Link key={item.label} to={item.path} className={cn("w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200", isActive ? "bg-emerald-500 text-white shadow-lg" : "text-sidebar-foreground hover:bg-slate-700/50 hover:text-white")}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>;
        })}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn("w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200", location.pathname.startsWith("/settings") ? "bg-emerald-500 text-white shadow-lg" : "text-sidebar-foreground hover:bg-slate-700/50 hover:text-white")}>
                <Settings className="h-5 w-5" />
                Settings
                <ChevronDown className="h-4 w-4 ml-auto" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/settings/financial-data" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Manage Financial Data
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings/preferences" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Account Preferences
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </div>;
}