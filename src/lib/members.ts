// API functions for member management (mocked for now)

import { Member, Invite, Role } from "@/types/members";

// Mock data
const mockMembers: Member[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "OWNER",
    status: "active",
    joinedAt: "2024-01-15",
    avatarUrl: null,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "ADMIN",
    status: "active",
    joinedAt: "2024-02-20",
    avatarUrl: null,
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "MEMBER",
    status: "active",
    joinedAt: "2024-03-10",
    avatarUrl: null,
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "VIEWER",
    status: "active",
    joinedAt: "2024-03-15",
    avatarUrl: null,
  },
];

const mockInvites: Invite[] = [
  {
    id: "inv-1",
    email: "alice@example.com",
    role: "MEMBER",
    status: "pending",
    invitedAt: "2024-08-20",
    expiresAt: "2024-08-27",
    inviteLink: "https://finmate.app/invite/abc123",
  },
  {
    id: "inv-2",
    email: "charlie@example.com",
    role: "VIEWER",
    status: "expired",
    invitedAt: "2024-08-10",
    expiresAt: "2024-08-17",
    inviteLink: "https://finmate.app/invite/def456",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function listMembers(query?: string): Promise<Member[]> {
  await delay(300);
  if (!query) return [...mockMembers];
  
  const filtered = mockMembers.filter(member => 
    member.name?.toLowerCase().includes(query.toLowerCase()) ||
    member.email.toLowerCase().includes(query.toLowerCase())
  );
  return filtered;
}

export async function listInvites(): Promise<Invite[]> {
  await delay(300);
  return [...mockInvites];
}

export async function inviteMember(input: { 
  email: string; 
  role: Exclude<Role, "OWNER"> 
}): Promise<Invite> {
  await delay(500);
  
  // Simulate validation
  if (mockMembers.some(m => m.email === input.email)) {
    throw new Error("User is already a member");
  }
  
  if (mockInvites.some(i => i.email === input.email && i.status === "pending")) {
    throw new Error("User already has a pending invitation");
  }
  
  const newInvite: Invite = {
    id: `inv-${Date.now()}`,
    email: input.email,
    role: input.role,
    status: "sent",
    invitedAt: new Date().toISOString().split('T')[0],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    inviteLink: `https://finmate.app/invite/${Math.random().toString(36).substr(2, 9)}`,
  };
  
  mockInvites.push(newInvite);
  return newInvite;
}

export async function resendInvite(id: string): Promise<void> {
  await delay(300);
  const invite = mockInvites.find(i => i.id === id);
  if (!invite) {
    throw new Error("Invite not found");
  }
  
  invite.status = "sent";
  invite.invitedAt = new Date().toISOString().split('T')[0];
  invite.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

export async function revokeInvite(id: string): Promise<void> {
  await delay(300);
  const index = mockInvites.findIndex(i => i.id === id);
  if (index === -1) {
    throw new Error("Invite not found");
  }
  
  mockInvites.splice(index, 1);
}

export async function updateRole(id: string, role: Role): Promise<Member> {
  await delay(400);
  const member = mockMembers.find(m => m.id === id);
  if (!member) {
    throw new Error("Member not found");
  }
  
  if (member.role === "OWNER") {
    throw new Error("Cannot change owner role");
  }
  
  member.role = role;
  return { ...member };
}

export async function removeMember(id: string): Promise<void> {
  await delay(400);
  const index = mockMembers.findIndex(m => m.id === id);
  if (index === -1) {
    throw new Error("Member not found");
  }
  
  const member = mockMembers[index];
  if (member.role === "OWNER") {
    throw new Error("Cannot remove owner");
  }
  
  mockMembers.splice(index, 1);
}