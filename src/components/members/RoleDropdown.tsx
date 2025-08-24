import { Crown, Shield, User, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@/types/members";

const roleConfig = {
  OWNER: { icon: Crown, label: "Owner", variant: "secondary" as const },
  ADMIN: { icon: Shield, label: "Admin", variant: "default" as const },
  MEMBER: { icon: User, label: "Member", variant: "outline" as const },
  VIEWER: { icon: Eye, label: "Viewer", variant: "outline" as const },
};

interface RoleDropdownProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  disabled?: boolean;
}

export function RoleDropdown({ currentRole, onRoleChange, disabled }: RoleDropdownProps) {
  const isOwner = currentRole === "OWNER";
  const config = roleConfig[currentRole];
  const Icon = config.icon;

  if (isOwner || disabled) {
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge 
          variant={config.variant} 
          className="gap-1 cursor-pointer hover:bg-accent/80 transition-colors"
        >
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-popover">
        {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][])
          .filter(([role]) => role !== "OWNER")
          .map(([role, conf]) => {
            const RoleIcon = conf.icon;
            return (
              <DropdownMenuItem
                key={role}
                onClick={() => onRoleChange(role)}
                className={currentRole === role ? "bg-accent" : ""}
              >
                <RoleIcon className="h-4 w-4 mr-2" />
                {conf.label}
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}