export type ArtifactStatus = 'missing' | 'pending' | 'ready' | 'blocked';
export type ChangeStatus = 'active' | 'complete' | 'archived';
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
  severity: "CRITICAL" | "WARNING" | "SUGGESTION" | "OK";
  message: string;
  artifact?: string;
}

export interface ValidationCheck {
  file: string;
  valid: boolean;
  warnings: string[];
  errors: string[];
}

export interface ValidationSummary {
  total: number;
  valid: number;
  invalid: number;
}

export interface ValidationOutput {
  version: string;
  results: {
    changes: Array<{
      name: string;
      valid: boolean;
      warnings: string[];
      errors?: string[];
      checks?: ValidationCheck[];
    }>;
  };
  summary: ValidationSummary;
}
