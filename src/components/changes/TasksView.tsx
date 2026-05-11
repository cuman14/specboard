import { CheckCircle2, Circle } from "lucide-react";
import { useMemo } from "react";

interface Task {
  id: string;
  label: string;
  done: boolean;
  layer?: string;
}

interface Layer {
  title: string;
  tasks: Task[];
}

function parseTasks(markdown: string): Layer[] {
  const lines = markdown.split("\n");
  const layers: Layer[] = [];
  let currentLayer: Layer | null = null;

  for (const line of lines) {
    // Detect section headers (## Capa X or ## Section)
    const headingMatch = line.match(/^#{1,3}\s+(.+)/);
    if (headingMatch) {
      const title = headingMatch[1].trim();
      // Skip progress/summary sections
      if (/progreso|secuencia|trigger|commit/i.test(title)) {
        currentLayer = null;
        continue;
      }
      currentLayer = { title, tasks: [] };
      layers.push(currentLayer);
      continue;
    }

    // Detect tasks: - [x] or - [ ]
    const taskMatch = line.match(
      /^[\s-]*\[([x ])\]\s+\*{0,2}([^*\n]+)\*{0,2}/i,
    );
    if (taskMatch && currentLayer) {
      const done = taskMatch[1].toLowerCase() === "x";
      const label = taskMatch[2].trim();
      // Extract tag like T-1.1 from label
      currentLayer.tasks.push({
        id: `${currentLayer.title}-${currentLayer.tasks.length}`,
        label,
        done,
        layer: currentLayer.title,
      });
    }
  }

  // If no layers found (simple task list), put all tasks in one group
  if (layers.length === 0) {
    const defaultLayer: Layer = { title: "Tasks", tasks: [] };
    for (const line of lines) {
      const taskMatch = line.match(
        /^[\s-]*\[([x ])\]\s+\*{0,2}([^*\n]+)\*{0,2}/i,
      );
      if (taskMatch) {
        defaultLayer.tasks.push({
          id: `task-${defaultLayer.tasks.length}`,
          label: taskMatch[2].trim(),
          done: taskMatch[1].toLowerCase() === "x",
        });
      }
    }
    if (defaultLayer.tasks.length > 0) layers.push(defaultLayer);
  }

  return layers.filter((l) => l.tasks.length > 0);
}

function extractTag(label: string): { tag: string | null; text: string } {
  const match = label.match(/^(T-[\d.]+)\s+(.+)/);
  if (match) return { tag: match[1], text: match[2] };
  return { tag: null, text: label };
}

export default function TasksView({ content }: { content: string }) {
  const layers = useMemo(() => parseTasks(content), [content]);

  if (layers.length === 0) {
    return <p className="text-sm text-[#908fa0]">No tasks found</p>;
  }

  const totalTasks = layers.flatMap((l) => l.tasks).length;
  const doneTasks = layers.flatMap((l) => l.tasks).filter((t) => t.done).length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#a1a5b7]">
            {doneTasks} / {totalTasks} tasks completed
          </span>
          <span className="font-medium text-[#e8ecf4]">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#222a3d]">
          <div
            className="h-full rounded-full bg-[#6366f1] transition-all duration-300"
            style={{ width: `${pct}%` }}
            aria-label={`Progress: ${pct}%`}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Layers */}
      {layers.map((layer) => {
        const layerDone = layer.tasks.filter((t) => t.done).length;
        return (
          <div key={layer.title} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3
                className="text-xs font-semibold uppercase tracking-widest text-[#a1a5b7]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {layer.title}
              </h3>
              <span className="text-xs text-[#6b7280]">
                {layerDone}/{layer.tasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {layer.tasks.map((task) => {
                const { tag, text } = extractTag(task.label);
                return (
                  <div
                    key={task.id}
                    className={`flex cursor-pointer items-start gap-3 rounded border px-3 py-2.5 transition-colors focus-within:ring-1 focus-within:ring-[#6366f1] ${
                      task.done
                        ? "border-[#22c55e]/30 bg-[#22c55e]/10"
                        : "border-[#4b5563] bg-[#171f33]"
                    }`}
                    tabIndex={0}
                    role="listitem"
                    aria-checked={task.done}
                  >
                    {task.done ? (
                      <CheckCircle2
                        size={15}
                        className="mt-0.5 shrink-0 text-[#22c55e]"
                        strokeWidth={2}
                      />
                    ) : (
                      <Circle
                        size={15}
                        className="mt-0.5 shrink-0 text-[#6b7280]"
                        strokeWidth={1.5}
                      />
                    )}
                    <div className="flex flex-1 flex-wrap items-start gap-2">
                      {tag && (
                        <span
                          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: task.done
                              ? "rgba(34,197,94,0.12)"
                              : "rgba(99,102,241,0.15)",
                            color: task.done ? "#22c55e" : "#6366f1",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {tag}
                        </span>
                      )}
                      <span
                        className={`text-xs leading-relaxed ${task.done ? "text-[#9ca3af] line-through" : "text-[#d1d5db]"}`}
                      >
                        {text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
