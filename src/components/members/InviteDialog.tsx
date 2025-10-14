import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { inviteMember } from "@/lib/members";
import { Invite } from "@/types/members";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type InviteForm = z.infer<typeof inviteSchema>;

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InviteDialog({ open, onOpenChange, onSuccess }: InviteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteResult, setInviteResult] = useState<Invite | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: InviteForm) => {
    setIsSubmitting(true);
    try {
      const invite = await inviteMember({
        email: data.email,
      });
      setInviteResult(invite);

      toast({
        title: "Invite link generated",
        description: `Invitation link created for ${data.email}`,
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Failed to generate invite",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!inviteResult?.token) return;

    const inviteUrl = `${window.location.origin}/auth?token=${inviteResult.token}`;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Invite link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      form.reset();
      setInviteResult(null);
      setCopied(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Invite Link</DialogTitle>
          <DialogDescription>
            Create an invitation link to share with team members
          </DialogDescription>
        </DialogHeader>

        {!inviteResult ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="colleague@company.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Generating..." : "Generate link"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Invite link generated for:</span>
                <div className="font-medium">{inviteResult.email}</div>
              </div>

              {inviteResult.token && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">
                    Share this link with the person:
                  </span>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`${window.location.origin}/auth?token=${inviteResult.token}`}
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyLink}
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => handleClose(false)}>Done</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}