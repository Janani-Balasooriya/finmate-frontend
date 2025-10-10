import { useState } from "react";
import { Plus, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InviteDialog } from "@/components/members/InviteDialog";
import { InvitesTable } from "@/components/members/InvitesTable";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/*
  TODO: Connect to backend endpoints when ready:
  - GET /api/invitations → InvitesTable
  - POST /api/invitations {email,role} → InviteDialog
  - POST /api/invitations/{id}/resend → InvitesTable
  - DELETE /api/invitations/{id} → InvitesTable
*/

export function InvitationsPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Invitations</h2>
          <p className="text-muted-foreground">
            Send invitations to join your family and manage pending invites
          </p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Send Invitation
        </Button>
      </div>

      {/* Invitations Table */}
      <InvitesTable onInviteClick={() => setIsInviteOpen(true)} />

      {/* Invite Dialog */}
      <InviteDialog
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        onSuccess={() => {
          // Refresh or update state if needed
        }}
      />
    </div>
  );
}