import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MembersTable } from "@/components/members/MembersTable";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/*
  TODO: Connect to backend endpoints when ready:
  - GET /api/members?q=&page=&size= → MembersTable
  - PATCH /api/members/{id}/role {role} → MembersTable
  - DELETE /api/members/{id} → MembersTable
*/

export function MembersPage() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  // Check if user has admin role
  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      // Redirect non-admin users to profile settings
      navigate("/settings/preferences/profile");
    }
  }, [user, loading, navigate]);

  // Show loading state while checking user role
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied for non-admin users
  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShieldX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
          <Button
            onClick={() => navigate("/settings/preferences/profile")}
            variant="outline"
            className="mt-4"
          >
            Go to Profile Settings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-foreground">Team Members</h2>
          <p className="text-muted-foreground">
            Manage team access and permissions for FinMate
          </p>
        </div>

        {/* Members Table */}
        <MembersTable />
      </div>
    </TooltipProvider>
  );
}