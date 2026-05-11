import TasksView from "@/components/changes/TasksView";
import { MOCK_ARTIFACT_CONTENT } from "@/lib/mock-data";
import { isTauri, readArtifact } from "@/lib/tauri-commands";
import { formatDate, getArtifactProgress } from "@/lib/utils";
import { useChangesStore } from "@/store/changes.store";
import type { Artifact } from "@/types";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  CheckCircle2,
  Code,
  FileText,
  ListChecks,
  Palette,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";

const artifactIcons = {
  proposal: FileText,
  specs: Code,
  design: Palette,
  tasks: ListChecks,
};

const artifactStatusColors: Record<string, string> = {
  ready: "text-[#22c55e] border-[#22c55e]/30 bg-[#22c55e]/10",
  pending: "text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10",
  blocked: "text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10",
  missing: "text-[#908fa0] border-[#464554] bg-[#464554]/10",
};

function ArtifactTab({
  artifact,
  isActive,
  onClick,
}: {
  artifact: Artifact;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = artifactIcons[artifact.name];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "border-[#6366f1] text-[#dae2fd]"
          : "border-transparent text-[#908fa0] hover:text-[#c7c4d7]"
      }`}
    >
      <Icon size={14} strokeWidth={1.5} />
      <span className="capitalize">{artifact.name}</span>
      <span
        className={`ml-1 inline-flex rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${artifactStatusColors[artifact.status]}`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {artifact.status}
      </span>
    </button>
  );
}

export default function ChangeDetail() {
  const { changeId } = useParams<{ changeId: string }>();
  const navigate = useNavigate();
  const { changes } = useChangesStore();

  const change = changes.find((c) => c.id === changeId);

  // React pattern: useState for tab selection + artifact content
  const [activeTab, setActiveTab] = useState<Artifact["name"]>("proposal");
  const [content, setContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const activeArtifact = change?.artifacts.find((a) => a.name === activeTab);
  const { completed, total } = getArtifactProgress(change?.artifacts ?? []);

  // React pattern: useEffect to load artifact content when tab changes
  useEffect(() => {
    if (!activeArtifact || activeArtifact.status === "missing") {
      setContent(null);
      return;
    }

    setIsLoadingContent(true);

    if (!isTauri) {
      const key = `${changeId}/${activeTab}.md`;
      setTimeout(() => {
        setContent(
          MOCK_ARTIFACT_CONTENT[key] ??
            `# ${activeTab}\n\nContent for **${activeTab}** goes here.\n\nThis artifact is marked as \`${activeArtifact.status}\`.`,
        );
        setIsLoadingContent(false);
      }, 150);
      return;
    }

    readArtifact(activeArtifact.path)
      .then((text) => {
        setContent(text);
        setIsLoadingContent(false);
      })
      .catch(() => {
        setContent(null);
        setIsLoadingContent(false);
      });
  }, [activeTab, activeArtifact?.path, changeId]);

  if (!change) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <AlertCircle
            size={32}
            className="mx-auto mb-2 text-[#464554]"
            strokeWidth={1}
          />
          <p className="text-sm text-[#908fa0]">Change not found</p>
          <button
            onClick={() => navigate("/changes")}
            className="mt-3 text-xs text-[#6366f1] hover:underline"
          >
            Back to changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#464554] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/changes")}
            className="flex items-center gap-1.5 text-xs text-[#908fa0] transition-colors hover:text-[#dae2fd]"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Changes
          </button>
          <span className="text-[#464554]">/</span>
          <span
            className="text-sm font-medium text-[#dae2fd]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {change.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress */}
          <span className="text-xs text-[#908fa0]">
            {completed}/{total} artifacts
          </span>
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#2d3449]">
            <div
              className="h-full rounded-full bg-[#6366f1]"
              style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
            />
          </div>

          <button className="flex items-center gap-1.5 rounded border border-[#464554] bg-transparent px-2.5 py-1.5 text-xs text-[#c7c4d7] transition-colors hover:border-[#22c55e] hover:text-[#22c55e]">
            <CheckCircle2 size={13} strokeWidth={1.5} />
            Validate
          </button>
          <button className="flex items-center gap-1.5 rounded border border-[#464554] bg-transparent px-2.5 py-1.5 text-xs text-[#c7c4d7] transition-colors hover:border-[#6366f1] hover:text-[#6366f1]">
            <Archive size={13} strokeWidth={1.5} />
            Archive
          </button>
        </div>
      </div>

      {/* Artifact tabs */}
      <div className="flex border-b border-[#464554] bg-[#171f33]">
        {change.artifacts.map((artifact) => (
          <ArtifactTab
            key={artifact.name}
            artifact={artifact}
            isActive={activeTab === artifact.name}
            onClick={() => setActiveTab(artifact.name)}
          />
        ))}
      </div>

      {/* Metadata bar */}
      <div className="flex items-center gap-4 border-b border-[#464554]/50 px-4 py-1.5">
        <span className="text-xs text-[#908fa0]">
          Schema:{" "}
          <span
            className="text-[#c7c4d7]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {change.schema}
          </span>
        </span>
        <span className="text-xs text-[#908fa0]">
          Created:{" "}
          <span className="text-[#c7c4d7]">{formatDate(change.createdAt)}</span>
        </span>
        {activeArtifact?.lastModified && (
          <span className="text-xs text-[#908fa0]">
            Last modified:{" "}
            <span className="text-[#c7c4d7]">
              {formatDate(activeArtifact.lastModified)}
            </span>
          </span>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-5">
        {isLoadingContent ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#464554] border-t-[#6366f1]" />
          </div>
        ) : activeArtifact?.status === "missing" ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#464554] bg-[#171f33]">
              {(() => {
                const Icon = artifactIcons[activeTab];
                return (
                  <Icon size={22} className="text-[#464554]" strokeWidth={1} />
                );
              })()}
            </div>
            <p className="text-sm text-[#908fa0]">
              <span className="capitalize">{activeTab}</span> artifact not yet
              created
            </p>
            <p className="text-xs text-[#464554]">
              Run{" "}
              <code className="text-[#6366f1]">
                openspec instructions --change {change.name}
              </code>{" "}
              to see next steps
            </p>
          </div>
        ) : content ? (
          activeTab === "tasks" ? (
            <TasksView content={content} />
          ) : (
            <div style={{ color: "#d1d5db", fontFamily: "var(--font-sans)" }}>
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
                      style={{ color: "#818cf8", textDecoration: "underline" }}
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
          )
        ) : (
          <p className="text-sm text-[#a1a5b7]">Unable to load content</p>
        )}
      </div>
    </div>
  );
}
