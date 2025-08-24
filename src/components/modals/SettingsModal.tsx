import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Palette } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Shield className="mr-2 h-4 w-4" />
              Privacy & Security
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </Button>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}