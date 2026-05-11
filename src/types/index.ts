export type ArtifactStatus = 'missing' | 'pending' | 'ready' | 'blocked';
export type ChangeStatus = 'active' | 'archived' | 'blocked';
export type KanbanColumn = 'draft' | 'in-review' | 'validated';

export interface Artifact {
  name: 'proposal' | 'specs' | 'design' | 'tasks';
  status: ArtifactStatus;
  path: string;
  lastModified?: string;
}

export interface Change {
  id: string;
  name: string;
  status: ChangeStatus;
  schema: string;
  createdAt: string;
  artifacts: Artifact[];
  tasksTotal: number;
  tasksCompleted: number;
  column: KanbanColumn;
}

export interface WorkspaceInfo {
  path: string;
  isValid: boolean;
  profile: 'core' | 'expanded';
  changesCount: number;
  archivedCount: number;
}

export interface SpecFile {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: SpecFile[];
  lastModified?: string;
}

export interface ActivityItem {
  id: string;
  changeId: string;
  changeName: string;
  artifactName: string;
  action: 'created' | 'updated' | 'validated' | 'archived';
  timestamp: string;
}

export interface ValidationResult {
  changeId: string;
  severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION' | 'OK';
  message: string;
  artifact?: string;
}
