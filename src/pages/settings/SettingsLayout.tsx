import { Outlet, useLocation } from "react-router-dom";
import { Settings, User, Users, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const settingsNavItems = [
  {
    id: "profile",
    label: "Profile Settings",
    icon: User,
    path: "/settings/profile"
  },
  {
    id: "members",
    label: "Members",
    icon: Users,
    path: "/settings/members"
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    path: "/settings/notifications"
  }
];

export function SettingsLayout() {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || "profile";

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Settings Navigation */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <Tabs value={currentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-t-xl h-auto p-1">
            {settingsNavItems.map((item) => (
              <TabsTrigger 
                key={item.id} 
                value={item.id}
                asChild
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <Link 
                  to={item.path}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </Tabs>
      </Card>
    </div>
  );
}