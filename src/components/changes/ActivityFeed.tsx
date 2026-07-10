import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_ACTIVITY } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import type { ActivityItem } from "@/types";
import { Activity, Clock } from "lucide-react";

interface ActivityFeedProps {
  useMock: boolean;
}

function ActivityFeed({ useMock }: ActivityFeedProps) {
  return (
    <div className="flex w-64 flex-col border-l border-border">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <Activity size={14} className="text-muted-foreground" strokeWidth={1.5} />
        <span
          className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Activity
        </span>
      </div>
      <ScrollArea className="flex-1">
        {useMock ? (
          <div className="px-3 py-2">
            {MOCK_ACTIVITY.map((item: ActivityItem) => (
              <div key={item.id} className="mb-3 flex items-start gap-2">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-foreground">
                    <span className="font-medium">{item.changeName}</span>
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {item.action} {item.artifactName}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    {formatRelativeTime(item.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-xs text-muted-foreground">
            <Clock size={20} className="mb-2 text-border" strokeWidth={1} />
            No activity yet
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default ActivityFeed;
