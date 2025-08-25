import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InviteDialog } from "@/components/members/InviteDialog";
import { MembersTable } from "@/components/members/MembersTable";
import { InvitesTable } from "@/components/members/InvitesTable";

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