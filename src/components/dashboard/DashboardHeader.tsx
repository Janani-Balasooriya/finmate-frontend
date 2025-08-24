import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader() {
  return (
    <header className="flex justify-between items-center p-6 bg-background border-b border-border">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Janani Balasooriya</span>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback className="bg-primary text-primary-foreground">JB</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}