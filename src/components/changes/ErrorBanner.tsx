import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-center gap-2 rounded border border-destructive/30 bg-destructive/10 px-3 py-2">
      <AlertCircle size={16} className="shrink-0 text-destructive" strokeWidth={1.5} />
      <span className="flex-1 text-xs text-destructive">{message}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
        onClick={onDismiss}
      >
        <X size={14} strokeWidth={1.5} />
      </Button>
    </div>
  );
}

export default ErrorBanner;
