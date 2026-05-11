import { openInExplorer } from "@/lib/tauri-commands";
import { useWorkspaceStore } from "@/store/workspace.store";
import { BookOpen, FolderOpen } from "lucide-react";

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
      <div className="flex items-center gap-2 border-b border-[#464554] pb-2.5">
        <BookOpen size={14} className="text-[#908fa0]" strokeWidth={1.5} />
        <span
          className="text-[10px] font-semibold uppercase tracking-widest text-[#908fa0]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Specs
        </span>
      </div>

      <button
        onClick={handleOpenFolder}
        className="flex items-center gap-2 rounded border border-[#464554] bg-[#171f33] px-3 py-2 text-xs text-[#c7c4d7] transition-colors hover:border-[#6366f1] hover:text-[#dae2fd]"
      >
        <FolderOpen size={14} strokeWidth={1.5} />
        Open specs folder
      </button>
    </div>
  );
}
