import { useState } from "react";
import { Bell, Mail, MessageSquare, DollarSign, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    // Email notifications
    emailExpenses: true,
    emailBudgets: true,
    emailGoals: false,
    emailInvites: true,
    emailSummary: "weekly",
    
    // Push notifications
    pushExpenses: false,
    pushBudgets: true,
    pushGoals: true,
    pushInvites: true,
    
    // In-app notifications
    inAppAll: true,
    inAppSound: false,
    
    // Marketing
    marketing: false,
    productUpdates: true,
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated successfully.",
      });
    }, 1000);
  };

  const updateNotification = (key: keyof typeof notifications, value: boolean | string) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Choose which activities you want to receive email notifications for.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Expense Alerts
              </p>
              <p className="text-sm text-muted-foreground">
                Get notified when large expenses are added
              </p>
            </div>
            <Switch
              checked={notifications.emailExpenses}
              onCheckedChange={(checked) => updateNotification('emailExpenses', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Budget Warnings
              </p>
              <p className="text-sm text-muted-foreground">
                Get notified when you're close to budget limits
              </p>
            </div>
            <Switch
              checked={notifications.emailBudgets}
              onCheckedChange={(checked) => updateNotification('emailBudgets', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Goal Updates
              </p>
              <p className="text-sm text-muted-foreground">
                Get notified about shared goal progress and milestones
              </p>
            </div>
            <Switch
              checked={notifications.emailGoals}
              onCheckedChange={(checked) => updateNotification('emailGoals', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Team Invitations</p>
              <p className="text-sm text-muted-foreground">
                Get notified when you're invited to teams
              </p>
            </div>
            <Switch
              checked={notifications.emailInvites}
              onCheckedChange={(checked) => updateNotification('emailInvites', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Summary</p>
              <p className="text-sm text-muted-foreground">
                Receive a summary of your financial activity
              </p>
            </div>
            <Select 
              value={notifications.emailSummary} 
              onValueChange={(value) => updateNotification('emailSummary', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
            <Badge variant="secondary" className="text-xs">Desktop</Badge>
          </CardTitle>
          <CardDescription>
            Real-time browser notifications for important activities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Large Expenses</p>
              <p className="text-sm text-muted-foreground">
                Instant alerts for expenses over your threshold
              </p>
            </div>
            <Switch
              checked={notifications.pushExpenses}
              onCheckedChange={(checked) => updateNotification('pushExpenses', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Budget Alerts</p>
              <p className="text-sm text-muted-foreground">
                When you reach 80% of any budget category
              </p>
            </div>
            <Switch
              checked={notifications.pushBudgets}
              onCheckedChange={(checked) => updateNotification('pushBudgets', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Goal Milestones</p>
              <p className="text-sm text-muted-foreground">
                When shared goals reach 25%, 50%, 75%, and 100%
              </p>
            </div>
            <Switch
              checked={notifications.pushGoals}
              onCheckedChange={(checked) => updateNotification('pushGoals', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Team Invitations</p>
              <p className="text-sm text-muted-foreground">
                Instant notifications for team invites
              </p>
            </div>
            <Switch
              checked={notifications.pushInvites}
              onCheckedChange={(checked) => updateNotification('pushInvites', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            In-App Notifications
          </CardTitle>
          <CardDescription>
            Notifications that appear while you're using FinMate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show All Notifications</p>
              <p className="text-sm text-muted-foreground">
                Display notifications in the app interface
              </p>
            </div>
            <Switch
              checked={notifications.inAppAll}
              onCheckedChange={(checked) => updateNotification('inAppAll', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sound Effects</p>
              <p className="text-sm text-muted-foreground">
                Play sounds for notifications
              </p>
            </div>
            <Switch
              checked={notifications.inAppSound}
              onCheckedChange={(checked) => updateNotification('inAppSound', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Marketing & Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing & Product Updates</CardTitle>
          <CardDescription>
            Communications about new features and promotional content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-muted-foreground">
                Tips, tricks, and promotional content
              </p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) => updateNotification('marketing', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Product Updates</p>
              <p className="text-sm text-muted-foreground">
                New features and important app updates
              </p>
            </div>
            <Switch
              checked={notifications.productUpdates}
              onCheckedChange={(checked) => updateNotification('productUpdates', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Notification Settings"}
        </Button>
      </div>
    </div>
  );
}