import { Outlet, useLocation } from "react-router-dom";
import { Settings, User, Users, Bell, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const accountPreferencesNavItems = [
  {
    id: "profile",
    label: "Profile Settings",
    icon: User,
    path: "/settings/preferences/profile"
  },
  // {
  //   id: "notifications",
  //   label: "Notifications",
  //   icon: Bell,
  //   path: "/settings/preferences/notifications"
  // },
  {
    id: "members",
    label: "Members",
    icon: Users,
    path: "/settings/preferences/members"
  },
  {
    id: "invitations",
    label: "Invitations",
    icon: Mail,
    path: "/settings/preferences/invitations"
  }
];

export function AccountPreferencesLayout() {
  const location = useLocation();
  const { user } = useUser();
  const currentTab = location.pathname.split('/')[3] || "profile";

  // Filter navigation items based on user role
  const filteredNavItems = accountPreferencesNavItems.filter(item => {
    // Only show Members and Invitations tabs for admin users
    if (item.id === "members" || item.id === "invitations") {
      return user?.role === "admin";
    }
    return true; // Show all other tabs
  });

  // Adjust grid columns based on number of visible tabs
  const gridCols = filteredNavItems.length === 4 ? "grid-cols-4" :
                   filteredNavItems.length === 3 ? "grid-cols-3" :
                   filteredNavItems.length === 2 ? "grid-cols-2" : "grid-cols-1";

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Account Preferences</h1>
          <p className="text-muted-foreground">
            Manage your profile settings and preferences
          </p>
        </div>
      </div>

      {/* Account Preferences Navigation */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <Tabs value={currentTab} className="w-full">
          <TabsList className={`grid w-full ${gridCols} rounded-t-xl h-auto p-1`}>
            {filteredNavItems.map((item) => (
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