import type { Change, WorkspaceInfo, ActivityItem, SpecFile } from "@/types";

export const MOCK_WORKSPACE: WorkspaceInfo = {
  path: "C:/Projects/my-saas-app",
  isValid: true,
  profile: "core",
  changesCount: 4,
  archivedCount: 7,
};

export const MOCK_CHANGES: Change[] = [
  {
    id: "add-auth-flow",
    name: "add-auth-flow",
    status: "active",
    schema: "core",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    artifacts: [
      { name: "proposal", status: "ready", path: "/openspec/changes/add-auth-flow/proposal.md", lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "specs", status: "ready", path: "/openspec/changes/add-auth-flow/specs.md", lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "design", status: "pending", path: "/openspec/changes/add-auth-flow/design.md" },
      { name: "tasks", status: "missing", path: "/openspec/changes/add-auth-flow/tasks.md" },
    ],
    tasksTotal: 0,
    tasksCompleted: 0,
    column: "in-review",
  },
  {
    id: "refactor-api-client",
    name: "refactor-api-client",
    status: "active",
    schema: "core",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    artifacts: [
      { name: "proposal", status: "ready", path: "/openspec/changes/refactor-api-client/proposal.md" },
      { name: "specs", status: "ready", path: "/openspec/changes/refactor-api-client/specs.md" },
      { name: "design", status: "ready", path: "/openspec/changes/refactor-api-client/design.md" },
      { name: "tasks", status: "ready", path: "/openspec/changes/refactor-api-client/tasks.md" },
    ],
    tasksTotal: 8,
    tasksCompleted: 5,
    column: "validated",
  },
  {
    id: "implement-dashboard",
    name: "implement-dashboard",
    status: "active",
    schema: "expanded",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    artifacts: [
      { name: "proposal", status: "ready", path: "/openspec/changes/implement-dashboard/proposal.md" },
      { name: "specs", status: "missing", path: "/openspec/changes/implement-dashboard/specs.md" },
      { name: "design", status: "missing", path: "/openspec/changes/implement-dashboard/design.md" },
      { name: "tasks", status: "missing", path: "/openspec/changes/implement-dashboard/tasks.md" },
    ],
    tasksTotal: 0,
    tasksCompleted: 0,
    column: "draft",
  },
  {
    id: "fix-error-handling",
    name: "fix-error-handling",
    status: "blocked",
    schema: "core",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    artifacts: [
      { name: "proposal", status: "ready", path: "/openspec/changes/fix-error-handling/proposal.md" },
      { name: "specs", status: "blocked", path: "/openspec/changes/fix-error-handling/specs.md" },
      { name: "design", status: "missing", path: "/openspec/changes/fix-error-handling/design.md" },
      { name: "tasks", status: "missing", path: "/openspec/changes/fix-error-handling/tasks.md" },
    ],
    tasksTotal: 0,
    tasksCompleted: 0,
    column: "draft",
  },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    changeId: "add-auth-flow",
    changeName: "add-auth-flow",
    artifactName: "specs",
    action: "updated",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    changeId: "refactor-api-client",
    changeName: "refactor-api-client",
    artifactName: "tasks",
    action: "updated",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    changeId: "implement-dashboard",
    changeName: "implement-dashboard",
    artifactName: "proposal",
    action: "created",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    changeId: "add-auth-flow",
    changeName: "add-auth-flow",
    artifactName: "proposal",
    action: "validated",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    changeId: "refactor-api-client",
    changeName: "refactor-api-client",
    artifactName: "design",
    action: "updated",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_SPEC_TREE: SpecFile[] = [
  {
    name: "architecture",
    path: "/openspec/specs/architecture",
    isDirectory: true,
    children: [
      { name: "api-design.md", path: "/openspec/specs/architecture/api-design.md", isDirectory: false, lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "database-schema.md", path: "/openspec/specs/architecture/database-schema.md", isDirectory: false, lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "system-overview.md", path: "/openspec/specs/architecture/system-overview.md", isDirectory: false, lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    name: "features",
    path: "/openspec/specs/features",
    isDirectory: true,
    children: [
      { name: "auth.md", path: "/openspec/specs/features/auth.md", isDirectory: false, lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "dashboard.md", path: "/openspec/specs/features/dashboard.md", isDirectory: false, lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  { name: "glossary.md", path: "/openspec/specs/glossary.md", isDirectory: false, lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { name: "project-overview.md", path: "/openspec/specs/project-overview.md", isDirectory: false, lastModified: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
];

export const MOCK_ARTIFACT_CONTENT: Record<string, string> = {
  "add-auth-flow/proposal.md": `# Proposal: Add Authentication Flow

## Summary
Implement a complete authentication system using JWT tokens with refresh token rotation.

## Motivation
The current app has no authentication, which blocks production deployment.

## Approach
- Use JWT access tokens (15min expiry) + refresh tokens (7 days)
- Implement \`/auth/login\`, \`/auth/refresh\`, \`/auth/logout\` endpoints
- Add middleware for protected routes
- Store tokens in httpOnly cookies

## Success Criteria
- [ ] Users can log in with email + password
- [ ] Sessions persist across browser refreshes
- [ ] Invalid tokens are rejected with 401
- [ ] Logout invalidates the session
`,
  "add-auth-flow/specs.md": `# Specs: Add Authentication Flow

## API Endpoints

### POST /auth/login
**Request:**
\`\`\`json
{ "email": "string", "password": "string" }
\`\`\`
**Response:**
\`\`\`json
{ "accessToken": "string", "user": { "id": "string", "email": "string" } }
\`\`\`

### POST /auth/refresh
Uses httpOnly cookie containing refresh token.

### POST /auth/logout
Invalidates refresh token in DB and clears cookies.

## Security Requirements
- Passwords hashed with bcrypt (rounds: 12)
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
- CORS restricted to known origins
`,
};
