import { Progress } from "@/components/ui/progress";
import TaskItem from "./TaskItem";
import {
  isTauri,
  readArtifact,
  readTasks,
  writeArtifact,
  type TaskInfo,
} from "@/lib/tauri-commands";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Layer {
  title: string;
  tasks: TaskInfo[];
}

function groupByLayer(tasks: TaskInfo[]): Layer[] {
  const layers: Layer[] = [];
  let currentLayer: Layer | null = null;

  for (const task of tasks) {
    if (!task.layer || task.layer !== currentLayer?.title) {
      currentLayer = { title: task.layer ?? "Tasks", tasks: [] };
      layers.push(currentLayer);
    }
    currentLayer.tasks.push(task);
  }

  return layers;
}

export function toggleLine(
  markdown: string,
  lineIndex: number,
  done: boolean,
): string {
  const lines = markdown.split("\n");
  const line = lines[lineIndex];
  if (line === undefined) return markdown;
  if (done) {
    lines[lineIndex] = line.replace(/\[ \]/, "[x]");
  } else {
    lines[lineIndex] = line.replace(/\[x\]/i, "[ ]");
  }
  return lines.join("\n");
}

interface Task {
  id: string;
  label: string;
  done: boolean;
  lineIndex: number;
  layer?: string;
}

interface LocalLayer {
  title: string;
  tasks: Task[];
}

export function parseTasks(markdown: string): LocalLayer[] {
  const lines = markdown.split("\n");
  const layers: LocalLayer[] = [];
  let currentLayer: LocalLayer | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^#{1,3}\s+(.+)/);
    if (headingMatch) {
      const title = headingMatch[1].trim();
      if (/progreso|secuencia|trigger|commit/i.test(title)) {
        currentLayer = null;
        continue;
      }
      currentLayer = { title, tasks: [] };
      layers.push(currentLayer);
      continue;
    }

    const taskMatch = line.match(
      /^[\s-]*\[([x ])\]\s+\*{0,2}([^*\n]+)\*{0,2}/i,
    );
    if (taskMatch && currentLayer) {
      const done = taskMatch[1].toLowerCase() === "x";
      const label = taskMatch[2].trim();
      currentLayer.tasks.push({
        id: `${currentLayer.title}-${currentLayer.tasks.length}`,
        label,
        done,
        lineIndex: i,
        layer: currentLayer.title,
      });
    }
  }

  if (layers.length === 0) {
    const defaultLayer: LocalLayer = { title: "Tasks", tasks: [] };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const taskMatch = line.match(
        /^[\s-]*\[([x ])\]\s+\*{0,2}([^*\n]+)\*{0,2}/i,
      );
      if (taskMatch) {
        defaultLayer.tasks.push({
          id: `task-${defaultLayer.tasks.length}`,
          label: taskMatch[2].trim(),
          done: taskMatch[1].toLowerCase() === "x",
          lineIndex: i,
        });
      }
    }
    if (defaultLayer.tasks.length > 0) layers.push(defaultLayer);
  }

  return layers.filter((l) => l.tasks.length > 0);
}

interface TasksViewProps {
  content: string;
  filePath?: string;
  onTaskToggle?: () => void;
}

export default function TasksView({
  content,
  filePath,
  onTaskToggle,
}: TasksViewProps) {
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isTauri || !filePath) {
      if (content) {
        const localLayers = parseTasks(content);
        const mockTasks: TaskInfo[] = localLayers.flatMap((layer) =>
          layer.tasks.map((t) => ({
            id: t.id,
            label: t.label,
            done: t.done,
            line_index: t.lineIndex,
            layer: t.layer,
          })),
        );
        setTasks(mockTasks);
      } else {
        setTasks([]);
      }
      return;
    }

    setIsLoading(true);
    readTasks(filePath)
      .then((data) => {
        setTasks(data.tasks);
        setIsLoading(false);
      })
      .catch(() => {
        setTasks([]);
        setIsLoading(false);
      });
  }, [filePath, content]);

  const refreshTasks = useCallback(() => {
    if (!filePath) return;
    readTasks(filePath)
      .then((data) => setTasks(data.tasks))
      .catch(() => {});
  }, [filePath]);

  const layers = useMemo(() => groupByLayer(tasks), [tasks]);

  const handleToggle = useCallback(
    (task: TaskInfo) => {
      const newDone = !task.done;
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, done: newDone } : t)),
      );
      if (filePath) {
        readArtifact(filePath).then((currentContent) => {
          const newContent = toggleLine(currentContent, task.line_index, newDone);
          writeArtifact(filePath, newContent)
            .then(() => {
              refreshTasks();
              onTaskToggle?.();
            })
            .catch(() => {});
        });
      }
    },
    [filePath, refreshTasks, onTaskToggle],
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (layers.length === 0 && tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">No tasks found</p>;
  }

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted">
            {doneTasks} / {totalTasks} tasks completed
          </span>
          <span className="font-medium text-foreground">{pct}%</span>
        </div>
        <Progress value={pct} aria-label={`Progress: ${pct}%`} />
      </div>

      {layers.map((layer) => {
        const layerDone = layer.tasks.filter((t) => t.done).length;
        return (
          <div key={layer.title} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3
                className="text-xs font-semibold uppercase tracking-widest text-text-muted"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {layer.title}
              </h3>
              <span className="text-xs text-text-muted">
                {layerDone}/{layer.tasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {layer.tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleToggle} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
