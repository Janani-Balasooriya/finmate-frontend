import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { PageHeader } from "./PageHeader";

// Map routes to titles
const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/income": "Income", 
  "/expenses": "Expenses",
  "/budgets": "Budgets",
  "/shared-goals": "Shared Goals",
  "/subscriptions": "Subscriptions"
};

export function AppLayout() {
  const location = useLocation();
  const title = routeTitles[location.pathname] || "Dashboard";
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <PageHeader title={title} />
        
        <main className="mx-auto max-w-screen-2xl px-6 lg:px-8 pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}