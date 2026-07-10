import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskInfo } from "@/lib/tauri-commands";

interface TaskItemProps {
  task: TaskInfo;
  onToggle: (task: TaskInfo) => void;
}

function extractTag(label: string): { tag: string | null; text: string } {
  const match = label.match(/^(T-[\d.]+)\s+(.+)/);
  if (match) return { tag: match[1], text: match[2] };
  return { tag: null, text: label };
}

function TaskTag({ done, tag }: { done: boolean; tag: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold",
        done
          ? "bg-success/10 text-success"
          : "bg-primary/10 text-primary",
      )}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {tag}
    </span>
  );
}

function TaskItem({ task, onToggle }: TaskItemProps) {
  const { tag, text } = extractTag(task.label);

  function handleClick() {
    onToggle(task);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onToggle(task);
    }
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded border px-3 py-2.5 transition-colors focus-within:ring-1 focus-within:ring-primary",
        task.done
          ? "border-success/30 bg-success/10"
          : "border-border-subtle bg-card",
      )}
      tabIndex={0}
      role="checkbox"
      aria-checked={task.done}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {task.done ? (
        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" strokeWidth={2} />
      ) : (
        <Circle size={15} className="mt-0.5 shrink-0 text-text-muted" strokeWidth={1.5} />
      )}
      <div className="flex flex-1 flex-wrap items-start gap-2">
        {tag && <TaskTag done={task.done} tag={tag} />}
        <span
          className={cn(
            "text-xs leading-relaxed",
            task.done ? "text-text-muted line-through" : "text-text",
          )}
        >
          {text}
        </span>
      </div>
    </div>
  );
}

export default TaskItem;
