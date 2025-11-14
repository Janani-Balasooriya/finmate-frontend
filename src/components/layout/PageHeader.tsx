import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/auth";
import { useUser } from "@/contexts/UserContext";

interface PageHeaderProps {
  title: string;
  userName?: string;
  avatarUrl?: string;
}

export function PageHeader({ title, userName, avatarUrl }: PageHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useUser();

  // Use provided userName prop or fall back to context user name
  const displayName = userName || (user ? `Hi ${user.firstName}!` : '') || 'Hi User!';

  const handleLogout = () => {
    // Clear authentication data
    auth.logout();
    
    // Redirect to login page
    navigate("/auth");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : displayName}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full p-0 hover:bg-accent">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="User" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {loading ? '...' : user?.firstName?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {/* <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      <SettingsModal 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />
    </>
  );
}