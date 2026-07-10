import { Button } from "@/components/ui/button";
import type { ValidationOutput } from "@/types";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { useState } from "react";

interface ValidationBannerProps {
  result: ValidationOutput;
  onDismiss: () => void;
}

function getBannerStyle(
  valid: boolean,
  hasWarnings: boolean,
  hasErrors: boolean,
): string {
  if (valid && !hasWarnings && !hasErrors)
    return "border-success/30 bg-success/10";
  if (valid && hasWarnings) return "border-warning/30 bg-warning/10";
  return "border-destructive/30 bg-destructive/10";
}

function getSummaryText(
  valid: boolean,
  warningCount: number,
  errorCount: number,
): string {
  if (valid && warningCount === 0) return "All checks passed";
  if (valid)
    return `Valid with ${warningCount} warning${warningCount > 1 ? "s" : ""}`;
  return `${errorCount} error${errorCount > 1 ? "s" : ""} found`;
}

export default function ValidationBanner({
  result,
  onDismiss,
}: ValidationBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const changeResult = result.results.changes[0];
  if (!changeResult) return null;

  const { valid, warnings } = changeResult;
  const rawErrors: string[] = changeResult.errors ?? [];
  const errors =
    !valid && rawErrors.length === 0
      ? ["Validation failed — check artifact structure"]
      : rawErrors;

  const hasWarnings = warnings.length > 0;
  const hasErrors = errors.length > 0;
  const hasIssues = hasWarnings || hasErrors;
  const { summary } = result;

  const bannerClass = getBannerStyle(valid, hasWarnings, hasErrors);
  const summaryText = getSummaryText(valid, warnings.length, errors.length);

  function handleToggleExpanded() {
    setExpanded((prev) => !prev);
  }

  return (
    <div className={`mx-4 mt-2 rounded border ${bannerClass}`}>
      <div className="flex items-center gap-2 px-3 py-2">
        {valid && !hasIssues ? (
          <CheckCircle2
            size={16}
            className="shrink-0 text-success"
            strokeWidth={1.5}
          />
        ) : valid && hasWarnings ? (
          <AlertTriangle
            size={16}
            className="shrink-0 text-warning"
            strokeWidth={1.5}
          />
        ) : (
          <AlertCircle
            size={16}
            className="shrink-0 text-destructive"
            strokeWidth={1.5}
          />
        )}

        <span className="flex-1 text-sm font-medium text-foreground">
          {summaryText}
        </span>

        <span className="text-xs text-muted-foreground">
          {summary.valid}/{summary.total} valid
        </span>

        {hasIssues && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            onClick={handleToggleExpanded}
          >
            {expanded ? (
              <ChevronDown size={14} strokeWidth={1.5} />
            ) : (
              <ChevronRight size={14} strokeWidth={1.5} />
            )}
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          onClick={onDismiss}
        >
          <X size={14} strokeWidth={1.5} />
        </Button>
      </div>

      {hasIssues && expanded && (
        <div className="border-t border-border/20 px-3 py-2">
          {hasWarnings && (
            <div className="mb-2">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-warning">
                Warnings
              </p>
              <ul className="space-y-1">
                {warnings.map((w) => (
                  <li
                    key={w}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasErrors && (
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-destructive">
                Errors
              </p>
              <ul className="space-y-1">
                {errors.map((e) => (
                  <li
                    key={e}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-destructive" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
