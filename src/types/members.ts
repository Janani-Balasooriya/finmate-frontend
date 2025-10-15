type Role = "ADMIN" | "MEMBER";
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
  role: "MEMBER"; // All invitations are for MEMBER role
  status: "pending" | "sent" | "expired" | "revoked";
  invitedAt: string;
  expiresAt?: string | null;
  token: string;
};

export type { Role, Status };