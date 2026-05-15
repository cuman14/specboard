import { openInExplorer } from "@/lib/tauri-commands";
import { useWorkspaceStore } from "@/store/workspace.store";
import { BookOpen, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SpecsSidebar() {
  const workspace = useWorkspaceStore((s) => s.workspace);

  const handleOpenFolder = async () => {
    if (!workspace?.path) return;
    const specsPath = workspace.path + "/openspec/specs";
    try {
      await openInExplorer(specsPath);
    } catch {
      // Silent fail - folder might not exist
    }
  };

  return (
    <div className="flex flex-col gap-4 px-3 py-4">
      <div className="flex items-center gap-2 pb-2.5">
        <BookOpen size={14} className="text-muted-foreground" strokeWidth={1.5} />
        <span
          className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Specs
        </span>
      </div>
      <Separator />

      <Button
        onClick={handleOpenFolder}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <FolderOpen size={14} strokeWidth={1.5} />
        Open specs folder
      </Button>
    </div>
  );
}
