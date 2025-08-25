// API functions for member management

import { Member, Invite, Role } from "@/types/members";
import { httpClient } from "./http";

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

export async function listInvites(): Promise<Invite[]> {
  try {
    const response = await httpClient.get<ApiResponse<Invite[]>>('/invites');
    
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

export async function inviteMember(input: { 
  email: string; 
}): Promise<Invite> {
  try {
    const response = await httpClient.post<ApiResponse<Invite>>('/invites', input);
    
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

export async function resendInvite(id: string): Promise<void> {
  try {
    const response = await httpClient.post<ApiResponse<void>>(`/invites/${id}/resend`);
    
    if (!response.success) {
      throw new Error(response.message || response.error || 'Failed to resend invitation');
    }
  } catch (error) {
    console.error('Error resending invitation:', error);
    throw error;
  }
}

export async function revokeInvite(id: string): Promise<void> {
  try {
    const response = await httpClient.delete<ApiResponse<void>>(`/invites/${id}`);
    
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