import type { Artifact } from "@/types";
import { artifactIcons } from "./artifactIcons";

interface ArtifactEmptyStateProps {
  artifact: Artifact;
  changeName: string;
}

function ArtifactEmptyState({ artifact, changeName }: ArtifactEmptyStateProps) {
  const Icon = artifactIcons[artifact.name];

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-card">
        <Icon size={22} className="text-border" strokeWidth={1} />
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="capitalize">{artifact.name}</span> artifact not yet
        created
      </p>
      <p className="text-xs text-border">
        Run{" "}
        <code className="text-primary">
          openspec instructions --change {changeName}
        </code>{" "}
        to see next steps
      </p>
    </div>
  );
}

export default ArtifactEmptyState;
