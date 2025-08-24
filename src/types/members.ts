type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
type Status = "active" | "invited" | "pending" | "expired";

export type Member = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  status: "active";
  joinedAt?: string;
  avatarUrl?: string | null;
};

export type Invite = {
  id: string;
  email: string;
  role: Exclude<Role, "OWNER">;
  status: "pending" | "sent" | "expired" | "revoked";
  invitedAt: string;
  expiresAt?: string | null;
  inviteLink?: string;
};

export type { Role, Status };