import { cn } from "@/lib/utils";
import { BookOpen, GitBranch, Kanban, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { to: "/changes", icon: GitBranch, label: "Changes" },
  { to: "/kanban", icon: Kanban, label: "Kanban" },
  { to: "/specs", icon: BookOpen, label: "Specs" },
];

export default function UtilityBar() {
  return (
    <TooltipProvider>
      <div
        className="flex h-full w-12 flex-col items-center border-r border-border bg-background py-2"
        style={{ width: "var(--spacing-utility-bar, 48px)", minWidth: 48 }}
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center">
          <img
            src="/logo.png"
            alt="Specboard"
            className="h-7 w-7 object-contain"
          />
        </div>

        <nav className="flex flex-1 flex-col items-center gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Tooltip key={to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "relative flex h-10 w-10 items-center justify-center rounded transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-[#c7c4d7]",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
                      )}
                      <Icon size={18} strokeWidth={1.5} />
                    </>
                  )}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>

        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to="/settings"
              className="flex h-10 w-10 items-center justify-center rounded text-muted-foreground transition-colors hover:text-[#c7c4d7]"
            >
              <Settings size={18} strokeWidth={1.5} />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
