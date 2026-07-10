import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { SpecFile } from "@/types";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useState } from "react";

interface FileTreeNodeProps {
  file: SpecFile;
  depth: number;
  selectedPath: string | null;
  onSelect: (file: SpecFile) => void;
}

function FileTreeNode({ file, depth, selectedPath, onSelect }: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const isSelected = selectedPath === file.path;

  if (file.isDirectory) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            onClick={() => onSelect(file)}
            className={`flex w-full cursor-pointer items-center gap-1.5 px-2 py-1 text-left text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-primary ${
              isSelected
                ? "bg-surface-high text-foreground"
                : "text-muted-foreground hover:bg-surface-high hover:text-foreground"
            }`}
            style={{ paddingLeft: `${8 + depth * 12}px` }}
          >
            {isOpen ? (
              <ChevronDown
                size={12}
                className="shrink-0 text-muted-foreground"
                strokeWidth={1.5}
              />
            ) : (
              <ChevronRight
                size={12}
                className="shrink-0 text-muted-foreground"
                strokeWidth={1.5}
              />
            )}
            {isOpen ? (
              <FolderOpen
                size={13}
                className="shrink-0 text-warning"
                strokeWidth={1.5}
              />
            ) : (
              <Folder
                size={13}
                className="shrink-0 text-warning"
                strokeWidth={1.5}
              />
            )}
            <span className="truncate">{file.name}</span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {file.children?.map((child) => (
            <FileTreeNode
              key={child.path}
              file={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <button
      onClick={() => onSelect(file)}
      className={`flex w-full cursor-pointer items-center gap-1.5 py-1 text-left text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-primary ${
        isSelected
          ? "bg-surface-high text-foreground"
          : "text-muted-foreground hover:bg-surface-high hover:text-foreground"
      }`}
      style={{ paddingLeft: `${8 + depth * 12}px`, paddingRight: "8px" }}
    >
      <FileText
        size={12}
        className="shrink-0 text-primary"
        strokeWidth={1.5}
      />
      <span className="truncate">{file.name}</span>
    </button>
  );
}

export default FileTreeNode;
