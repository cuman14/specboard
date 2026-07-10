import ArtifactEmptyState from "@/components/changes/ArtifactEmptyState";
import { artifactIcons } from "@/components/changes/artifactIcons";
import ErrorBanner from "@/components/changes/ErrorBanner";
import TasksView from "@/components/changes/TasksView";
import ValidationBanner from "@/components/changes/ValidationBanner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_ARTIFACT_CONTENT, MOCK_VALIDATION_RESULT } from "@/lib/mock-data";
import { isTauri, readArtifact, validateChange } from "@/lib/tauri-commands";
import { formatDateTime, getArtifactProgress } from "@/lib/utils";
import { useChangesStore } from "@/store/changes.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import type { Artifact, ValidationOutput } from "@/types";
import { AlertCircle, Archive, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ARTIFACT_STATUS_COLORS: Record<string, string> = {
  ready: "text-success border-success/30 bg-success/10",
  pending: "text-warning border-warning/30 bg-warning/10",
  blocked: "text-destructive border-destructive/30 bg-destructive/10",
  missing: "text-muted-foreground border-border bg-border/10",
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-primary bg-primary/10 border-primary/30",
  complete: "text-success bg-success/10 border-success/30",
  archived: "text-muted-foreground bg-muted-foreground/10 border-muted-foreground/30",
};

export default function ChangeDetail() {
  const { changeId } = useParams<{ changeId: string }>();
  const navigate = useNavigate();
  const {
    loadChanges,
    setActiveChange,
    changes,
    archivedChanges,
    activeChange,
    refreshAllChanges,
  } = useChangesStore();
  const isLoading = useChangesStore((s) => s.isLoading);
  const workspace = useWorkspaceStore((s) => s.workspace);
  const useMock = useWorkspaceStore((s) => s.useMock);

  const change = activeChange;

  useEffect(() => {
    if (workspace?.path && changes.length === 0 && !isLoading) {
      loadChanges(workspace.path);
    }
  }, [workspace?.path, changes.length, isLoading, loadChanges]);

  useEffect(() => {
    if (!changeId) return;
    const all = [...changes, ...archivedChanges];
    const found = all.find((c) => c.id === changeId);
    if (found && found.id !== activeChange?.id) {
      setActiveChange(found);
    }
  }, [changeId, changes, archivedChanges, activeChange, setActiveChange]);

  const [activeTab, setActiveTab] = useState<Artifact["name"]>("proposal");
  const [content, setContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isValidationLoading, setIsValidationLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationOutput | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const activeArtifact = change?.artifacts.find((a) => a.name === activeTab);
  const { completed, total } = getArtifactProgress(change?.artifacts ?? []);
  const allTasksDone =
    change != null && (change.tasksTotal === 0 || change.tasksCompleted === change.tasksTotal);

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

  async function handleArchive() {
    if (!change) return;
    setIsArchiving(true);
    setArchiveError(null);
    try {
      await useChangesStore.getState().archiveChange(change.name);
      navigate("/changes");
    } catch (err) {
      setArchiveError(String(err));
      setIsArchiving(false);
    }
  }

  async function handleValidate() {
    if (!change) return;
    setIsValidationLoading(true);
    setValidationResult(null);
    setValidationError(null);
    try {
      if (!isTauri || useMock) {
        await new Promise((r) => setTimeout(r, 500));
        setValidationResult(MOCK_VALIDATION_RESULT);
      } else {
        const result = await validateChange(change.name, workspace?.path ?? "");
        setValidationResult(result);
      }
    } catch (err) {
      setValidationError(String(err));
    } finally {
      setIsValidationLoading(false);
    }
  }

  function handleTaskToggle() {
    if (workspace?.path) refreshAllChanges(workspace.path);
  }

  function handleTabChange(v: string) {
    setActiveTab(v as Artifact["name"]);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!change) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <AlertCircle size={32} className="mx-auto mb-2 text-border" strokeWidth={1} />
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
          <span className="text-xs text-muted-foreground">
            {completed}/{total} artifacts
          </span>
          <Progress value={total > 0 ? (completed / total) * 100 : 0} className="h-1.5 w-20" />

          <Button
            variant="outline"
            size="sm"
            className="active:scale-95 transition-transform"
            onClick={handleValidate}
            disabled={isValidationLoading}
          >
            {isValidationLoading ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border border-t-primary" />
            ) : (
              <CheckCircle2 size={13} strokeWidth={1.5} />
            )}
            Validate
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="active:scale-95 transition-transform"
                disabled={!allTasksDone || isArchiving}
                title={!allTasksDone ? "Complete all tasks before archiving" : "Archive this change"}
              >
                {isArchiving ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border border-t-primary" />
                ) : (
                  <Archive size={13} strokeWidth={1.5} />
                )}
                Archive
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive this change?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will move{" "}
                  <span style={{ fontFamily: "var(--font-mono)" }}>{change.name}</span>{" "}
                  to the archive. This action cannot be undone from the UI.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleArchive}>Archive</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {archiveError && (
        <div className="px-4 pt-2">
          <ErrorBanner message={archiveError} onDismiss={() => setArchiveError(null)} />
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-1 flex-col overflow-hidden min-h-0"
      >
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
                    className={`ml-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${ARTIFACT_STATUS_COLORS[artifact.status]}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {artifact.status}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="flex items-center gap-4 border-b border-border/50 px-4 py-1.5">
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold ${STATUS_COLORS[change.status]}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {change.status === "archived" && "✓ "}
            {change.status}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Schema:{" "}
            <span className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
              {change.schema}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            Created:{" "}
            <span className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
              {formatDateTime(change.createdAt)}
            </span>
          </span>
          {activeArtifact?.lastModified && (
            <span className="text-xs text-muted-foreground">
              Last modified:{" "}
              <span className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                {formatDateTime(activeArtifact.lastModified)}
              </span>
            </span>
          )}
        </div>

        {change.artifacts.map((artifact) => (
          <TabsContent
            key={artifact.name}
            value={artifact.name}
            className="flex-1 overflow-hidden m-0"
          >
            <div className="flex h-full flex-col">
              {(validationResult || validationError) && (
                <div className="px-4 pt-2">
                  {validationResult && (
                    <ValidationBanner
                      result={validationResult}
                      onDismiss={() => setValidationResult(null)}
                    />
                  )}
                  {validationError && (
                    <ErrorBanner
                      message={validationError}
                      onDismiss={() => setValidationError(null)}
                    />
                  )}
                </div>
              )}
              <ScrollArea className="flex-1 p-5">
                {artifact.name === activeTab && (
                  <>
                    {isLoadingContent ? (
                      <div className="flex h-full items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
                      </div>
                    ) : artifact.status === "missing" ? (
                      <ArtifactEmptyState artifact={artifact} changeName={change.name} />
                    ) : content && artifact.name === "tasks" ? (
                      <TasksView
                        content={content}
                        filePath={artifact.path}
                        onTaskToggle={handleTaskToggle}
                      />
                    ) : content ? (
                      <MarkdownRenderer content={content} />
                    ) : (
                      <p className="m-auto max-w-sm text-center text-xs text-destructive">
                        Unable to load content
                      </p>
                    )}
                  </>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
