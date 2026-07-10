import FileTreeNode from "@/components/specs/FileTreeNode";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MOCK_SPEC_TREE } from "@/lib/mock-data";
import { readArtifact, readSpecsTree } from "@/lib/tauri-commands";
import { formatRelativeTime } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace.store";
import type { SpecFile } from "@/types";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

function resolveSpecPath(file: SpecFile): string {
  if (!file.isDirectory) return file.path;
  const specChild = file.children?.find((c) => c.name === "spec.md");
  if (specChild) return specChild.path;
  const sep = file.path.includes("\\") ? "\\" : "/";
  return file.path + sep + "spec.md";
}

export default function SpecsExplorer() {
  const workspace = useWorkspaceStore((s) => s.workspace);
  const useMock = useWorkspaceStore((s) => s.useMock);

  const [tree, setTree] = useState<SpecFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<SpecFile | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  useEffect(() => {
    if (!workspace?.path) return;
    if (useMock) {
      setTree(MOCK_SPEC_TREE);
      return;
    }
    readSpecsTree(workspace.path)
      .then(setTree)
      .catch(() => setTree([]));
  }, [workspace?.path, useMock]);

  useEffect(() => {
    if (!selectedFile) {
      setContent(null);
      return;
    }

    const pathToLoad = resolveSpecPath(selectedFile);
    setIsLoadingContent(true);
    setLoadError(null);

    readArtifact(pathToLoad)
      .then((text) => {
        setContent(text);
        setIsLoadingContent(false);
      })
      .catch((err) => {
        setContent(null);
        setLoadError(String(err));
        setIsLoadingContent(false);
      });
  }, [selectedFile]);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex w-56 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <BookOpen size={13} className="text-muted-foreground" strokeWidth={1.5} />
          <span
            className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Specs
          </span>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="py-1">
            {tree.length === 0 ? (
              <p className="px-3 py-4 text-xs text-muted-foreground">
                No spec files found
              </p>
            ) : (
              tree.map((file) => (
                <FileTreeNode
                  key={file.path}
                  file={file}
                  depth={0}
                  selectedPath={selectedFile?.path ?? null}
                  onSelect={setSelectedFile}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span
                className="text-sm font-medium text-foreground"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {selectedFile.name}
              </span>
              {selectedFile.lastModified && (
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(selectedFile.lastModified)}
                </span>
              )}
            </div>
            <ScrollArea className="flex-1">
              <div className="p-5">
                {isLoadingContent ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
                  </div>
                ) : content ? (
                  <MarkdownRenderer content={content} />
                ) : (
                  <p className="m-auto max-w-sm text-center text-xs text-destructive">
                    {loadError ?? "Unable to load file"}
                  </p>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <BookOpen size={36} className="text-border" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">Select a spec file to view</p>
          </div>
        )}
      </div>
    </div>
  );
}
