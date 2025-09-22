import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";

export function DashboardHeader() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <header className="flex justify-between items-center p-6 bg-background border-b border-border">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Loading...</span>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground">...</AvatarFallback>
          </Avatar>
        </div>
      </header>
    );
  }

  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.slice(0, 2) || 'U' : 'U';

  return (
    <header className="flex justify-between items-center p-6 bg-background border-b border-border">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{user ? `${user.firstName} ${user.lastName}`.trim() || 'User' : 'User'}</span>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}