// API functions for member management

import { Member, Invite, Role } from "@/types/members";
import { httpClient } from "./http";
import { useUser } from "@/contexts/UserContext";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function listMembers(query?: string): Promise<Member[]> {
  try {
    const endpoint = query ? `/members?query=${encodeURIComponent(query)}` : '/members';
    const response = await httpClient.get<ApiResponse<Member[]>>(endpoint);

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || response.error || 'Failed to fetch members');
    }
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
}

export async function listInvites(familyId: string): Promise<Invite[]> {
  try {
    // Use family-specific endpoint to get invites for current user's family
    const endpoint =  `/families/${familyId}/invites`;
    const response = await httpClient.get<ApiResponse<Invite[]>>(endpoint);

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || response.error || 'Failed to fetch invites');
    }
  } catch (error) {
    console.error('Error fetching invites:', error);
    throw error;
  }
}

export async function inviteMember(input?: {
  email?: string;
  familyId?: string;
}): Promise<Invite> {
  try {
    // Use family-specific endpoint if familyId is provided, otherwise use generic invites
    const endpoint = input?.familyId ? `/families/${input.familyId}/invites` : '/invites';
    const response = await httpClient.post<ApiResponse<Invite>>(endpoint, {});

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || response.error || 'Failed to send invitation');
    }
  } catch (error) {
    console.error('Error sending invitation:', error);
    throw error;
  }
}

export async function resendInvite(id: string, familyId?: string): Promise<void> {
  try {
    const endpoint = familyId ? `/families/${familyId}/invites/${id}/resend` : `/invites/${id}/resend`;
    const response = await httpClient.post<ApiResponse<void>>(endpoint);

    if (!response.success) {
      throw new Error(response.message || response.error || 'Failed to resend invitation');
    }
  } catch (error) {
    console.error('Error resending invitation:', error);
    throw error;
  }
}

export async function revokeInvite(id: string, familyId?: string): Promise<void> {
  try {
    const endpoint = familyId ? `/families/${familyId}/invites/${id}` : `/invites/${id}`;
    const response = await httpClient.delete<ApiResponse<void>>(endpoint);

    if (!response.success) {
      throw new Error(response.message || response.error || 'Failed to revoke invitation');
    }
  } catch (error) {
    console.error('Error revoking invitation:', error);
    throw error;
  }
}

export async function updateRole(id: string, role: Role): Promise<Member> {
  try {
    const response = await httpClient.patch<ApiResponse<Member>>(`/members/${id}/role`, { role });

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || response.error || 'Failed to update member role');
    }
  } catch (error) {
    console.error('Error updating member role:', error);
    throw error;
  }
}

export async function removeMember(id: string): Promise<void> {
  try {
    const response = await httpClient.delete<ApiResponse<void>>(`/members/${id}`);

    if (!response.success) {
      throw new Error(response.message || response.error || 'Failed to remove member');
    }
  } catch (error) {
    console.error('Error removing member:', error);
    throw error;
  }
}