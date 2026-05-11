import SpecsSidebar from "@/components/specs/SpecsSidebar";
import { cn } from "@/lib/utils";
import { useChangesStore } from "@/store/changes.store";
import { Circle, GitBranch } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const statusDot: Record<string, string> = {
  active: "bg-[#6366f1]",
  blocked: "bg-[#ef4444]",
  archived: "bg-[#464554]",
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
      className="flex h-full flex-col border-r border-[#464554] bg-[#171f33]"
      style={{ width: "var(--spacing-sidebar, 240px)", minWidth: 240 }}
    >
      {showChangesList ? (
        <>
          <div className="flex items-center gap-2 border-b border-[#464554] px-3 py-2.5">
            <GitBranch size={14} className="text-[#908fa0]" strokeWidth={1.5} />
            <span
              className="text-[10px] font-semibold uppercase tracking-widest text-[#908fa0]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Changes
            </span>
          </div>
          <nav className="flex-1 overflow-y-auto py-1">
            {changes.map((change) => (
              <NavLink
                key={change.id}
                to={`/changes/${change.id}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-[#222a3d] text-[#dae2fd]"
                      : "text-[#c7c4d7] hover:bg-[#1c2438] hover:text-[#dae2fd]",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 h-4 w-0.5 rounded-r bg-[#6366f1]" />
                    )}
                    <Circle
                      size={6}
                      className={cn(
                        "shrink-0 fill-current",
                        statusDot[change.status] ?? "bg-[#464554]",
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
              <p className="px-3 py-4 text-xs text-[#908fa0]">
                No active changes
              </p>
            )}
          </nav>
        </>
      ) : showSpecsSidebar ? (
        <SpecsSidebar />
      ) : (
        <div className="flex items-center gap-2 border-b border-[#464554] px-3 py-2.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest text-[#908fa0]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Explorer
          </span>
        </div>
      )}
    </div>
  );
}
