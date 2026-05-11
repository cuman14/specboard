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
          className={`flex w-full cursor-pointer items-center gap-1.5 px-2 py-1 text-left text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[#6366f1] ${
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
              className="shrink-0 text-[#fbbf24]"
              strokeWidth={1.5}
            />
          ) : (
            <Folder
              size={13}
              className="shrink-0 text-[#fbbf24]"
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
      className={`flex w-full cursor-pointer items-center gap-1.5 py-1 text-left text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[#6366f1] ${
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
                <span className="text-xs text-[#a1a5b7]">
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
                    color: "#d1d5db",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1
                          style={{
                            color: "#f3f4f6",
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            marginBottom: "0.75rem",
                            lineHeight: 1.3,
                          }}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2
                          style={{
                            color: "#e5e7eb",
                            fontSize: "1.2rem",
                            fontWeight: 600,
                            margin: "1.25rem 0 0.75rem",
                            lineHeight: 1.3,
                          }}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3
                          style={{
                            color: "#d1d5db",
                            fontSize: "1rem",
                            fontWeight: 600,
                            margin: "1rem 0 0.5rem",
                            lineHeight: 1.3,
                          }}
                        >
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p
                          style={{
                            color: "#d1d5db",
                            lineHeight: 1.8,
                            marginBottom: "1rem",
                          }}
                        >
                          {children}
                        </p>
                      ),
                      li: ({ children }) => (
                        <li
                          style={{
                            color: "#d1d5db",
                            marginBottom: "0.35rem",
                            lineHeight: 1.7,
                          }}
                        >
                          {children}
                        </li>
                      ),
                      code: ({ children }) => (
                        <code
                          style={{
                            background: "#1e293b",
                            color: "#818cf8",
                            padding: "0.15em 0.5em",
                            borderRadius: 4,
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.875em",
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
                        <strong style={{ color: "#f3f4f6", fontWeight: 700 }}>
                          {children}
                        </strong>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          style={{
                            color: "#818cf8",
                            textDecoration: "underline",
                          }}
                        >
                          {children}
                        </a>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote
                          style={{
                            borderLeft: "3px solid #6366f1",
                            paddingLeft: "1rem",
                            marginLeft: 0,
                            color: "#9ca3af",
                          }}
                        >
                          {children}
                        </blockquote>
                      ),
                      hr: () => (
                        <hr
                          style={{
                            borderColor: "#4b5563",
                            margin: "1.25rem 0",
                            borderStyle: "solid",
                            borderWidth: "1px 0 0 0",
                          }}
                        />
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="m-auto max-w-sm text-center text-xs text-[#f87171]">
                  {loadError ?? "Unable to load file"}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <BookOpen size={36} className="text-[#4b5563]" strokeWidth={1} />
            <p className="text-sm text-[#a1a5b7]">Select a spec file to view</p>
          </div>
        )}
      </div>
    </div>
  );
}
