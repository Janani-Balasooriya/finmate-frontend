import { useState } from "react";
import { Plus, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InviteDialog } from "@/components/members/InviteDialog";
import { MembersTable } from "@/components/members/MembersTable";
import { InvitesTable } from "@/components/members/InvitesTable";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/* 
  TODO: Connect to backend endpoints when ready:
  - GET /api/members?q=&page=&size= → MembersTable
  - GET /api/invitations → InvitesTable  
  - POST /api/invitations {email,role} → InviteDialog
  - PATCH /api/members/{id}/role {role} → MembersTable
  - DELETE /api/members/{id} → MembersTable
  - POST /api/invitations/{id}/resend → InvitesTable
  - DELETE /api/invitations/{id} → InvitesTable
*/

export function MembersPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("members");
  const { user, loading } = useUser();
  const navigate = useNavigate();

  // Check if user has ADMIN role
  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      // Redirect non-ADMIN users to profile settings
      navigate("/settings/profile");
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

  // Show access denied for non-ADMIN users
  if (user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShieldX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
          <Button 
            onClick={() => navigate("/settings/profile")} 
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Team Members</h2>
            <p className="text-muted-foreground">
              Manage team access and permissions for FinMate
            </p>
          </div>
          <Button onClick={() => setIsInviteOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Invite
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            <MembersTable />
          </TabsContent>

          <TabsContent value="invitations" className="space-y-6">
            <InvitesTable onInviteClick={() => setIsInviteOpen(true)} />
          </TabsContent>
        </Tabs>

        {/* Invite Dialog */}
        <InviteDialog
          open={isInviteOpen}
          onOpenChange={setIsInviteOpen}
          onSuccess={() => {
            setActiveTab("invitations");
          }}
        />
      </div>
    </TooltipProvider>
  );
}