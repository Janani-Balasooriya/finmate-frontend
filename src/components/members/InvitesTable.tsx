import { useState, useEffect } from "react";
import { 
  Clock, 
  Copy, 
  RotateCcw, 
  Trash2, 
  Plus, 
  Mail,
  Shield,
  User,
  Eye,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  listInvites,
  resendInvite,
  revokeInvite
} from "@/lib/members";
import { Invite } from "@/types/members";
import { useUser } from "@/contexts/UserContext";

const roleIcons = {
  admin: Shield,
  member: User,
};

const statusVariants = {
  pending: "default" as const,
  sent: "default" as const,
  expired: "outline" as const,
};

interface InvitesTableProps {
  onInviteClick: () => void;
}

export function InvitesTable({ onInviteClick }: InvitesTableProps) {
  const { user } = useUser();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [revokeDialog, setRevokeDialog] = useState<{
    open: boolean;
    invite: Invite | null;
  }>({ open: false, invite: null });
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadInvites();
    }
  }, [user]);

  const loadInvites = async () => {
    try {
      if (!user || !user.families?.id) {
        throw new Error("User family information not available");
      }
      const familyId = user.families.id.toString();
      const data = await listInvites(familyId);
      setInvites(data);
    } catch (error) {
      toast({
        title: "Failed to load invites",
        description: error instanceof Error ? error.message : "Could not fetch pending invitations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvite = async (invite: Invite) => {
    setActionLoading(invite.id);
    try {
      if (!user || !user.families?.id) {
        throw new Error("User family information not available");
      }
      const familyId = user.families.id.toString();
      await resendInvite(invite.id, familyId);
      await loadInvites(); // Refresh to get updated data
      toast({
        title: "Invite resent",
        description: `Invitation resent to ${invite.email}`,
      });
    } catch (error) {
      toast({
        title: "Failed to resend invite",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeInvite = async () => {
    if (!revokeDialog.invite) return;

    setActionLoading(revokeDialog.invite.id);
    try {
      if (!user || !user.families?.id) {
        throw new Error("User family information not available");
      }
      const familyId = user.families.id.toString();
      await revokeInvite(revokeDialog.invite.id, familyId);
      setInvites(prev => prev.filter(i => i.id !== revokeDialog.invite!.id));
      toast({
        title: "Invite revoked",
        description: `Invitation to ${revokeDialog.invite.email} has been revoked`,
      });
    } catch (error) {
      toast({
        title: "Failed to revoke invite",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
      setRevokeDialog({ open: false, invite: null });
    }
  };

  const handleCopyLink = async (invite: Invite) => {
    const inviteUrl = `${window.location.origin}/invite/${invite.token}`;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(invite.id);
      toast({
        title: "Link copied",
        description: "Invite link copied to clipboard",
      });
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const isExpired = (invite: Invite) => {
    if (invite.status === "expired") return true;
    if (!invite.expiresAt) return false;
    return new Date(invite.expiresAt) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card className="rounded-xl border bg-card shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (invites.length === 0) {
    return (
      <Card className="rounded-xl border bg-card shadow-sm p-8 text-center">
        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No open invitations</h3>
        <p className="text-muted-foreground mb-4">
          When you invite team members, their pending invitations will appear here
        </p>
        <Button onClick={onInviteClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Send first invite
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invited</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((invite, index) => {
              const expired = isExpired(invite);

              return (
                <TableRow key={invite.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={expired ? "destructive" : "default"}
                      className={expired ? "" : "bg-green-100 text-green-800 hover:bg-green-100"}
                    >
                      {expired ? "Expired" : "Active"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {invite.createdAt ? formatDate(invite.createdAt) : formatDate(invite.invitedAt)}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {invite.expiresAt ? formatDate(invite.expiresAt) : "-"}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      {expired ? null : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoading === invite.id}
                            >
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleCopyLink(invite)}>
                              {copiedLink === invite.id ? (
                                <Check className="h-4 w-4 mr-2" />
                              ) : (
                                <Copy className="h-4 w-4 mr-2" />
                              )}
                              {copiedLink === invite.id ? "Copied!" : "Copy link"}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => setRevokeDialog({ open: true, invite })}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Revoke
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Revoke confirmation */}
      <AlertDialog open={revokeDialog.open} onOpenChange={(open) => 
        setRevokeDialog({ open, invite: null })
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the invitation to{" "}
              <strong>{revokeDialog.invite?.email}</strong>? They will no longer be 
              able to use this invite link to join your team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeInvite}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke invite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}