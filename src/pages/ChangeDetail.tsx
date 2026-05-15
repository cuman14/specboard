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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const artifactIcons = {
  proposal: FileText,
  specs: Code,
  design: Palette,
  tasks: ListChecks,
};

const artifactStatusColors: Record<string, string> = {
  ready: "text-success border-success/30 bg-success/10",
  pending: "text-warning border-warning/30 bg-warning/10",
  blocked: "text-destructive border-destructive/30 bg-destructive/10",
  missing: "text-muted-foreground border-border bg-border/10",
};

export default function ChangeDetail() {
  const { changeId } = useParams<{ changeId: string }>();
  const navigate = useNavigate();
  const { changes } = useChangesStore();

  const change = changes.find((c) => c.id === changeId);

  const [activeTab, setActiveTab] = useState<Artifact["name"]>("proposal");
  const [content, setContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const activeArtifact = change?.artifacts.find((a) => a.name === activeTab);
  const { completed, total } = getArtifactProgress(change?.artifacts ?? []);

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
            className="mx-auto mb-2 text-border"
            strokeWidth={1}
          />
          <p className="text-sm text-muted-foreground">Change not found</p>
          <Button
            variant="link"
            onClick={() => navigate("/changes")}
            className="mt-3 text-xs"
          >
            Back to changes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/changes")}
            className="gap-1.5 text-xs text-muted-foreground"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Changes
          </Button>
          <span className="text-border">/</span>
          <span
            className="text-sm font-medium text-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {change.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress */}
          <span className="text-xs text-muted-foreground">
            {completed}/{total} artifacts
          </span>
          <Progress value={total > 0 ? (completed / total) * 100 : 0} className="h-1.5 w-20" />

          <Button variant="outline" size="sm" className="active:scale-95 transition-transform">
            <CheckCircle2 size={13} strokeWidth={1.5} />
            Validate
          </Button>
          <Button variant="outline" size="sm" className="active:scale-95 transition-transform">
            <Archive size={13} strokeWidth={1.5} />
            Archive
          </Button>
        </div>
      </div>

      {/* Artifact tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Artifact["name"])} className="flex flex-col">
        <div className="flex border-b border-border bg-card">
          <TabsList className="bg-transparent h-auto p-0 rounded-none gap-0">
            {change.artifacts.map((artifact) => {
              const Icon = artifactIcons[artifact.name];
              return (
                <TabsTrigger
                  key={artifact.name}
                  value={artifact.name}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground border-b-2 border-transparent rounded-none px-4 py-2.5 text-sm font-medium gap-1.5 cursor-pointer active:translate-y-0.5 transition-all"
                >
                  <Icon size={14} strokeWidth={1.5} />
                  <span className="capitalize">{artifact.name}</span>
                  <Badge
                    variant="outline"
                    className={`ml-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${artifactStatusColors[artifact.status]}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {artifact.status}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Metadata bar */}
        <div className="flex items-center gap-4 border-b border-border/50 px-4 py-1.5">
          <span className="text-xs text-muted-foreground">
            Schema:{" "}
            <span
              className="text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {change.schema}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            Created:{" "}
            <span className="text-muted-foreground">{formatDate(change.createdAt)}</span>
          </span>
          {activeArtifact?.lastModified && (
            <span className="text-xs text-muted-foreground">
              Last modified:{" "}
              <span className="text-muted-foreground">
                {formatDate(activeArtifact.lastModified)}
              </span>
            </span>
          )}
        </div>

        {/* Content area */}
        {change.artifacts.map((artifact) => (
          <TabsContent key={artifact.name} value={artifact.name} className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full p-5">
              {artifact.name === activeTab && (
                <>
                  {isLoadingContent ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
                    </div>
                  ) : artifact.status === "missing" ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-card">
                        {(() => {
                          const Icon = artifactIcons[artifact.name];
                          return (
                            <Icon size={22} className="text-border" strokeWidth={1} />
                          );
                        })()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="capitalize">{artifact.name}</span> artifact not yet
                        created
                      </p>
                      <p className="text-xs text-border">
                        Run{" "}
                        <code className="text-primary">
                          openspec instructions --change {change.name}
                        </code>{" "}
                        to see next steps
                      </p>
                    </div>
                  ) : content ? (
                    artifact.name === "tasks" ? (
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
                </>
              )}
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
