import { useState, useEffect } from "react";
import { Copy, Check, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { inviteMember } from "@/lib/members";
import { Invite } from "@/types/members";
import { useUser } from "@/contexts/UserContext";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InviteDialog({ open, onOpenChange, onSuccess }: InviteDialogProps) {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteResult, setInviteResult] = useState<Invite | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const handleGenerateLink = async () => {
    setIsSubmitting(true);
    try {
      const invite = await inviteMember({
        familyId: user?.families?.id?.toString()
      });
      setInviteResult(invite);

      // Generate QR code
      const inviteUrl = `https://app.finmate.io/invite/${invite.token}`;
      const qrCodeDataUrl = await QRCode.toDataURL(inviteUrl);
      setQrCodeUrl(qrCodeDataUrl);

      toast({
        title: "Invite link generated",
        description: "Invitation link created successfully",
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

    const inviteUrl = `https://app.finmate.io/invite/${inviteResult.token}`;

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
      setInviteResult(null);
      setCopied(false);
      setShowQR(false);
      setQrCodeUrl("");
    }
    onOpenChange(open);
  };

  const getExpirationText = () => {
    if (!inviteResult?.expiresAt) return "";
    const expiresAt = new Date(inviteResult.expiresAt);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      return `Expires in ${diffDays} days`;
    } else if (diffDays === 1) {
      return "Expires in 1 day";
    } else {
      return "Expires soon";
    }
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
          <div className="space-y-4">
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleGenerateLink} disabled={isSubmitting}>
                {isSubmitting ? "Generating..." : "Create invite link"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="text-sm text-muted-foreground">
                {getExpirationText()}
              </div>

              {inviteResult.token && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">
                    Share this invitation link:
                  </span>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`https://app.finmate.io/invite/${inviteResult.token}`}
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
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowQR(!showQR)}
                      className="flex items-center gap-1"
                    >
                      <QrCode className="h-4 w-4" />
                      {showQR ? "Hide QR Code" : "Show QR Code"}
                    </Button>
                  </div>
                  {showQR && (
                    <div className="flex justify-center p-4 bg-white rounded border">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="QR Code for invite link"
                          className="max-w-full h-auto"
                        />
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          Generating QR Code...
                        </div>
                      )}
                    </div>
                  )}
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