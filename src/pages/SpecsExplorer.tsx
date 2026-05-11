import { readArtifact, readSpecsTree } from "@/lib/tauri-commands";
import { formatRelativeTime } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace.store";
import type { SpecFile } from "@/types";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function FileTreeNode({
  file,
  depth,
  selectedPath,
  onSelect,
}: {
  file: SpecFile;
  depth: number;
  selectedPath: string | null;
  onSelect: (file: SpecFile) => void;
}) {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const isSelected = selectedPath === file.path;

  if (file.isDirectory) {
    return (
      <div>
        <button
          onClick={() => {
            setIsOpen((v) => !v);
            onSelect(file);
          }}
          className={`flex w-full items-center gap-1.5 px-2 py-1 text-left text-xs transition-colors ${
            isSelected
              ? "bg-[#222a3d] text-[#dae2fd]"
              : "text-[#c7c4d7] hover:bg-[#1c2438] hover:text-[#dae2fd]"
          }`}
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          {isOpen ? (
            <ChevronDown
              size={12}
              className="shrink-0 text-[#908fa0]"
              strokeWidth={1.5}
            />
          ) : (
            <ChevronRight
              size={12}
              className="shrink-0 text-[#908fa0]"
              strokeWidth={1.5}
            />
          )}
          {isOpen ? (
            <FolderOpen
              size={13}
              className="shrink-0 text-[#f59e0b]"
              strokeWidth={1.5}
            />
          ) : (
            <Folder
              size={13}
              className="shrink-0 text-[#f59e0b]"
              strokeWidth={1.5}
            />
          )}
          <span className="truncate">{file.name}</span>
        </button>
        {isOpen &&
          file.children?.map((child) => (
            <FileTreeNode
              key={child.path}
              file={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(file)}
      className={`flex w-full items-center gap-1.5 py-1 text-left text-xs transition-colors ${
        isSelected
          ? "bg-[#222a3d] text-[#dae2fd]"
          : "text-[#c7c4d7] hover:bg-[#1c2438] hover:text-[#dae2fd]"
      }`}
      style={{ paddingLeft: `${8 + depth * 12}px`, paddingRight: "8px" }}
    >
      <FileText
        size={12}
        className="shrink-0 text-[#6366f1]"
        strokeWidth={1.5}
      />
      <span className="truncate">{file.name}</span>
    </button>
  );
}

export default function SpecsExplorer() {
  const workspace = useWorkspaceStore((s) => s.workspace);
  const [tree, setTree] = useState<SpecFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<SpecFile | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // Load spec tree on mount / workspace change
  useEffect(() => {
    if (!workspace?.path) return;
    readSpecsTree(workspace.path)
      .then(setTree)
      .catch(() => setTree([]));
  }, [workspace?.path]);

  // Load file content when selection changes
  // If a directory is selected, auto-load spec.md inside it
  useEffect(() => {
    if (!selectedFile) {
      setContent(null);
      return;
    }
    setIsLoadingContent(true);

    let pathToLoad = selectedFile.path;
    if (selectedFile.isDirectory) {
      // Look for spec.md inside the directory (from children or construct path)
      const specChild = selectedFile.children?.find(
        (c) => c.name === "spec.md",
      );
      if (specChild) {
        pathToLoad = specChild.path;
      } else {
        // Fallback: construct the path directly
        const sep = selectedFile.path.includes("\\") ? "\\" : "/";
        pathToLoad = selectedFile.path + sep + "spec.md";
      }
    }

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
      {/* File tree panel */}
      <div className="flex w-56 flex-col border-r border-[#464554] bg-[#171f33]">
        <div className="flex items-center gap-2 border-b border-[#464554] px-3 py-2.5">
          <BookOpen size={13} className="text-[#908fa0]" strokeWidth={1.5} />
          <span
            className="text-[10px] font-semibold uppercase tracking-widest text-[#908fa0]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Specs
          </span>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {tree.length === 0 ? (
            <p className="px-3 py-4 text-xs text-[#908fa0]">
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
      </div>

      {/* Content pane */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between border-b border-[#464554] px-4 py-2.5">
              <span
                className="text-sm font-medium text-[#dae2fd]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {selectedFile.name}
              </span>
              {selectedFile.lastModified && (
                <span className="text-xs text-[#908fa0]">
                  {formatRelativeTime(selectedFile.lastModified)}
                </span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {isLoadingContent ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#464554] border-t-[#6366f1]" />
                </div>
              ) : content ? (
                <div
                  className="prose prose-invert prose-sm max-w-none"
                  style={{
                    color: "#c7c4d7",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1
                          style={{
                            color: "#dae2fd",
                            fontSize: "1.4rem",
                            fontWeight: 700,
                            marginBottom: "0.75rem",
                          }}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2
                          style={{
                            color: "#dae2fd",
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            margin: "1rem 0 0.5rem",
                          }}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3
                          style={{
                            color: "#c7c4d7",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            margin: "0.75rem 0 0.4rem",
                          }}
                        >
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p
                          style={{
                            color: "#c7c4d7",
                            lineHeight: 1.7,
                            marginBottom: "0.75rem",
                          }}
                        >
                          {children}
                        </p>
                      ),
                      li: ({ children }) => (
                        <li
                          style={{ color: "#c7c4d7", marginBottom: "0.25rem" }}
                        >
                          {children}
                        </li>
                      ),
                      code: ({ children }) => (
                        <code
                          style={{
                            background: "#222a3d",
                            color: "#6366f1",
                            padding: "0.1em 0.4em",
                            borderRadius: 3,
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.85em",
                          }}
                        >
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre
                          style={{
                            background: "#171f33",
                            padding: "1rem",
                            borderRadius: 4,
                            overflowX: "auto",
                            marginBottom: "1rem",
                          }}
                        >
                          {children}
                        </pre>
                      ),
                      strong: ({ children }) => (
                        <strong style={{ color: "#dae2fd", fontWeight: 600 }}>
                          {children}
                        </strong>
                      ),
                      hr: () => (
                        <hr
                          style={{ borderColor: "#464554", margin: "1rem 0" }}
                        />
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="m-auto max-w-sm text-center text-xs text-[#ef4444]">
                  {loadError ?? "Unable to load file"}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <BookOpen size={36} className="text-[#464554]" strokeWidth={1} />
            <p className="text-sm text-[#908fa0]">Select a spec file to view</p>
          </div>
        )}
      </div>
    </div>
  );
}
