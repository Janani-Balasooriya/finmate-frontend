import React, { useState, useEffect } from "react";
import { Search, MoreHorizontal, UserMinus, Crown, Shield, User, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { listMembers, updateRole, removeMember } from "@/lib/members";
import { Member, Role } from "@/types/members";
import { RoleDropdown } from "./RoleDropdown";

const roleIcons = {
  OWNER: Crown,
  ADMIN: Shield,
  MEMBER: User,
  VIEWER: Eye,
};

const roleVariants = {
  OWNER: "secondary" as const,
  ADMIN: "default" as const,
  MEMBER: "outline" as const,
  VIEWER: "outline" as const,
};

export function MembersTable() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [removeDialog, setRemoveDialog] = useState<{
    open: boolean;
    member: Member | null;
  }>({ open: false, member: null });

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMembers(members);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredMembers(
        members.filter(
          (member) =>
            member.name?.toLowerCase().includes(query) ||
            member.email.toLowerCase().includes(query)
        )
      );
    }
  }, [members, searchQuery]);

  const loadMembers = async () => {
    try {
      const data = await listMembers();
      setMembers(data);
    } catch (error) {
      toast({
        title: "Failed to load members",
        description: "Could not fetch team members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleUpdate = async (memberId: string, newRole: Member["role"]) => {
    setUpdateLoading(memberId);
    
    // Optimistic update
    const oldMembers = [...members];
    setMembers(prev => 
      prev.map(m => m.id === memberId ? { ...m, role: newRole } : m)
    );

    try {
      await updateRole(memberId, newRole);
      toast({
        title: "Role updated",
        description: "Member role has been updated successfully",
      });
    } catch (error) {
      // Rollback on error
      setMembers(oldMembers);
      toast({
        title: "Failed to update role",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleRemoveMember = async () => {
    if (!removeDialog.member) return;

    try {
      await removeMember(removeDialog.member.id);
      setMembers(prev => prev.filter(m => m.id !== removeDialog.member!.id));
      toast({
        title: "Member removed",
        description: `${removeDialog.member.name || removeDialog.member.email} has been removed from the team`,
      });
    } catch (error) {
      toast({
        title: "Failed to remove member",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setRemoveDialog({ open: false, member: null });
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className="rounded-xl border bg-card shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (members.length === 0) {
    return (
      <Card className="rounded-xl border bg-card shadow-sm p-8 text-center">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No team members yet</h3>
        <p className="text-muted-foreground mb-4">
          Get started by inviting your first team member to collaborate on FinMate
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => {
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatarUrl || undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(member.name, member.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">
                          {member.name || member.email}
                        </div>
                        {member.name && (
                          <div className="text-sm text-muted-foreground">
                            {member.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                   <TableCell>
                     <RoleDropdown
                       currentRole={member.role}
                       onRoleChange={(newRole) => handleRoleUpdate(member.id, newRole)}
                       disabled={updateLoading === member.id}
                     />
                   </TableCell>
                  
                  <TableCell className="text-muted-foreground">
                    {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "-"}
                  </TableCell>
                  
                   <TableCell>
                     {member.role !== "OWNER" && (
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button
                             variant="ghost"
                             size="sm"
                             disabled={updateLoading === member.id}
                           >
                             <MoreHorizontal className="h-4 w-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem
                             onClick={() => setRemoveDialog({ open: true, member })}
                             className="text-destructive focus:text-destructive"
                           >
                             <UserMinus className="h-4 w-4 mr-2" />
                             Remove member
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     )}
                   </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Remove member confirmation */}
      <AlertDialog open={removeDialog.open} onOpenChange={(open) => 
        setRemoveDialog({ open, member: null })
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{removeDialog.member?.name || removeDialog.member?.email}</strong>{" "}
              from your team? This action cannot be undone and they will lose access 
              to all financial data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}