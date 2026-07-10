import SpecsSidebar from "@/components/specs/SpecsSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useChangesStore } from "@/store/changes.store";
import { Circle, GitBranch } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const STATUS_DOT_COLOR: Record<string, string> = {
  active: "text-primary",
  complete: "text-success",
  archived: "text-border",
};

function ChangesList() {
  const changes = useChangesStore((s) => s.changes);

  return (
    <>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <GitBranch size={14} className="text-muted-foreground" strokeWidth={1.5} />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-mono">
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
                      STATUS_DOT_COLOR[change.status] ?? "text-border",
                    )}
                  />
                  <span className="truncate text-[13px]">{change.name}</span>
                </>
              )}
            </NavLink>
          ))}
          {changes.length === 0 && (
            <p className="px-3 py-4 text-xs text-muted-foreground">No active changes</p>
          )}
        </nav>
      </ScrollArea>
    </>
  );
}

function DefaultSidebar() {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-mono">
        Explorer
      </span>
    </div>
  );
}

function SidebarContent() {
  const location = useLocation();

  const showChangesList =
    location.pathname.startsWith("/changes") ||
    location.pathname.startsWith("/kanban");
  const showSpecsSidebar = location.pathname.startsWith("/specs");

  if (showChangesList) return <ChangesList />;
  if (showSpecsSidebar) return <SpecsSidebar />;
  return <DefaultSidebar />;
}

export default function Sidebar() {
  return (
    <div
      className="flex h-full flex-col border-r border-border bg-card"
      style={{ width: "var(--spacing-sidebar, 240px)", minWidth: 240 }}
    >
      <SidebarContent />
    </div>
  );
}
