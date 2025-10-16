type Role = "owner" | "admin" | "member" | "viewer";
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
  email?: string;
  role: Role; // Invitations can be for any role
  status: "pending" | "sent" | "expired" | "revoked";
  invitedAt: string;
  createdAt?: string;
  expiresAt?: string | null;
  token: string;
};

export type { Role, Status };