import SpecsSidebar from "@/components/specs/SpecsSidebar";
import { cn } from "@/lib/utils";
import { useChangesStore } from "@/store/changes.store";
import { Circle, GitBranch } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const statusDot: Record<string, string> = {
  active: "bg-primary",
  blocked: "bg-destructive",
  archived: "bg-border",
};

export default function Sidebar() {
  const location = useLocation();
  const changes = useChangesStore((s) => s.changes);

  const showChangesList =
    location.pathname.startsWith("/changes") ||
    location.pathname.startsWith("/kanban");
  const showSpecsSidebar = location.pathname.startsWith("/specs");

  return (
    <div
      className="flex h-full flex-col border-r border-border bg-card"
      style={{ width: "var(--spacing-sidebar, 240px)", minWidth: 240 }}
    >
      {showChangesList ? (
        <>
          <div className="flex items-center gap-2 px-3 py-2.5">
            <GitBranch size={14} className="text-muted-foreground" strokeWidth={1.5} />
            <span
              className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Changes
            </span>
          </div>
          <Separator />
          <ScrollArea className="flex-1">
            <nav className="py-1">
              {changes.map((change) => (
                <NavLink
                  key={change.id}
                  to={`/changes/${change.id}`}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-surface-high text-foreground"
                        : "text-muted-foreground hover:bg-[#1c2438] hover:text-foreground",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 h-4 w-0.5 rounded-r bg-primary" />
                      )}
                      <Circle
                        size={6}
                        className={cn(
                          "shrink-0 fill-current",
                          statusDot[change.status] ?? "bg-border",
                        )}
                        style={{
                          color:
                            change.status === "active"
                              ? "#6366f1"
                              : change.status === "blocked"
                                ? "#ef4444"
                                : "#464554",
                        }}
                      />
                      <span className="truncate text-[13px]">{change.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
              {changes.length === 0 && (
                <p className="px-3 py-4 text-xs text-muted-foreground">
                  No active changes
                </p>
              )}
            </nav>
          </ScrollArea>
        </>
      ) : showSpecsSidebar ? (
        <SpecsSidebar />
      ) : (
        <div className="flex items-center gap-2 px-3 py-2.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Explorer
          </span>
        </div>
      )}
    </div>
  );
}
