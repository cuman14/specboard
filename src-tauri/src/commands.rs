use serde::{Deserialize, Serialize};
use std::path::Path;
use tauri::AppHandle;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ArtifactInfo {
    pub name: String,
    pub status: String,
    pub path: String,
    pub last_modified: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChangeInfo {
    pub id: String,
    pub name: String,
    pub status: String,
    pub schema: String,
    pub created_at: String,
    pub artifacts: Vec<ArtifactInfo>,
    pub tasks_total: u32,
    pub tasks_completed: u32,
    pub column: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WorkspaceData {
    pub path: String,
    pub is_valid: bool,
    pub profile: String,
    pub changes: Vec<ChangeInfo>,
    pub changes_count: usize,
    pub archived_count: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandResult {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SpecFile {
    pub name: String,
    pub path: String,
    pub is_directory: bool,
    pub children: Option<Vec<SpecFile>>,
    pub last_modified: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TaskInfo {
    pub id: String,
    pub label: String,
    pub done: bool,
    pub line_index: usize,
    pub layer: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TasksData {
    pub tasks: Vec<TaskInfo>,
    pub total: usize,
    pub completed: usize,
}

#[tauri::command]
pub async fn open_folder_dialog(app: AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;
    let folder = app.dialog().file().blocking_pick_folder();
    Ok(folder.map(|p| p.to_string()))
}

#[tauri::command]
pub async fn read_workspace(path: String) -> Result<WorkspaceData, String> {
    use std::fs;

    let workspace_path = Path::new(&path);
    let openspec_path = workspace_path.join("openspec");

    if !openspec_path.exists() {
        return Ok(WorkspaceData {
            path: path.clone(),
            is_valid: false,
            profile: "core".to_string(),
            changes: vec![],
            changes_count: 0,
            archived_count: 0,
        });
    }

    let mut changes: Vec<ChangeInfo> = vec![];
    let changes_path = openspec_path.join("changes");

    if changes_path.exists() {
        if let Ok(entries) = fs::read_dir(&changes_path) {
            for entry in entries.flatten() {
                let entry_path = entry.path();
                if entry_path.is_dir() {
                    let name = entry.file_name().to_string_lossy().to_string();
                    if name == "archive" {
                        continue;
                    }
                    let artifacts = scan_artifacts(&entry_path);
                    let (tasks_total, tasks_completed) =
                        count_tasks(&entry_path.join("tasks.md"));

                    let status = if tasks_total > 0 && tasks_completed >= tasks_total {
                        "complete"
                    } else {
                        "active"
                    }
                    .to_string();

                    let created_at = entry_path
                        .metadata()
                        .ok()
                        .and_then(|m| m.created().ok())
                        .map(|t| {
                            let secs = t
                                .duration_since(std::time::UNIX_EPOCH)
                                .unwrap_or_default()
                                .as_secs();
                            format_timestamp(secs)
                        })
                        .unwrap_or_else(|| "unknown".to_string());

                    changes.push(ChangeInfo {
                        id: name.clone(),
                        name: name.clone(),
                        status,
                        schema: "core".to_string(),
                        created_at,
                        artifacts,
                        tasks_total,
                        tasks_completed,
                        column: "draft".to_string(),
                    });
                }
            }
        }
    }

    let archived_count = changes_path
        .join("archive")
        .read_dir()
        .map(|entries| entries.flatten().filter(|e| e.path().is_dir()).count())
        .unwrap_or(0);

    let profile = read_profile(&openspec_path);
    let changes_count = changes.len();

    Ok(WorkspaceData {
        path: path.clone(),
        is_valid: true,
        profile,
        changes,
        changes_count,
        archived_count,
    })
}

fn collect_md_files_sorted(dir: &Path, out: &mut Vec<String>) {
    use std::fs;
    if let Ok(mut entries) = fs::read_dir(dir).map(|e| e.flatten().collect::<Vec<_>>()) {
        entries.sort_by_key(|e| e.path());
        for entry in entries {
            let p = entry.path();
            if p.is_dir() {
                collect_md_files_sorted(&p, out);
            } else if p.extension().map(|e| e == "md").unwrap_or(false) {
                if let Ok(content) = fs::read_to_string(&p) {
                    out.push(content);
                }
            }
        }
    }
}

#[tauri::command]
pub async fn read_artifact(path: String) -> Result<String, String> {
    use std::fs;

    let file_path = Path::new(&path);

    if !file_path.exists() {
        return Err(format!("File not found: {}", path));
    }
    if file_path.is_dir() {
        let mut parts: Vec<String> = Vec::new();
        collect_md_files_sorted(file_path, &mut parts);
        if parts.is_empty() {
            return Err(format!("No .md files found in {}", path));
        }
        return Ok(parts.join("\n\n---\n\n"));
    }

    fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {} ({})", path, e))
}

#[tauri::command]
pub async fn run_openspec_command(
    cmd: String,
    args: Vec<String>,
    cwd: Option<String>,
) -> Result<CommandResult, String> {
    use tokio::process::Command;

    let mut command = if cfg!(windows) {
        let mut c = Command::new("cmd");
        c.arg("/C").arg("openspec");
        c.arg(&cmd);
        for arg in &args {
            c.arg(arg);
        }
        c
    } else {
        let mut c = Command::new("openspec");
        c.arg(&cmd);
        for arg in &args {
            c.arg(arg);
        }
        c
    };

    if let Some(dir) = cwd {
        command.current_dir(dir);
    }

    let output = command
        .output()
        .await
        .map_err(|e| format!("Failed to run openspec: {}", e))?;

    Ok(CommandResult {
        stdout: String::from_utf8_lossy(&output.stdout).to_string(),
        stderr: String::from_utf8_lossy(&output.stderr).to_string(),
        exit_code: output.status.code().unwrap_or(-1),
    })
}

#[tauri::command]
pub async fn read_specs_tree(workspace_path: String) -> Result<Vec<SpecFile>, String> {
    let specs_path = Path::new(&workspace_path).join("openspec").join("specs");
    if !specs_path.exists() {
        return Ok(vec![]);
    }
    let tree = read_dir_tree(&specs_path);
    Ok(tree)
}

fn dir_has_md_recursive(dir: &Path) -> bool {
    use std::fs;
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let p = entry.path();
            if p.is_file() && p.extension().map(|e| e == "md").unwrap_or(false) {
                return true;
            }
            if p.is_dir() && dir_has_md_recursive(&p) {
                return true;
            }
        }
    }
    false
}

fn scan_artifacts(change_path: &Path) -> Vec<ArtifactInfo> {
    let artifact_names = ["proposal", "specs", "design", "tasks"];
    artifact_names
        .iter()
        .map(|name| {
            // `specs` is a directory artifact, all others are flat .md files
            if *name == "specs" {
                let dir_path = change_path.join("specs");
                let has_md = dir_path.is_dir() && dir_has_md_recursive(&dir_path);
                let status = if has_md { "ready" } else { "missing" };
                let last_modified = dir_path
                    .metadata()
                    .ok()
                    .and_then(|m| m.modified().ok())
                    .map(|t| {
                        let secs = t
                            .duration_since(std::time::UNIX_EPOCH)
                            .unwrap_or_default()
                            .as_secs();
                        format_timestamp(secs)
                    });
                ArtifactInfo {
                    name: name.to_string(),
                    status: status.to_string(),
                    path: dir_path.to_string_lossy().to_string(),
                    last_modified,
                }
            } else {
                let file_path = change_path.join(format!("{}.md", name));
                let status = if file_path.exists() {
                    "ready"
                } else {
                    "missing"
                };
                let last_modified = file_path
                    .metadata()
                    .ok()
                    .and_then(|m| m.modified().ok())
                    .map(|t| {
                        let secs = t
                            .duration_since(std::time::UNIX_EPOCH)
                            .unwrap_or_default()
                            .as_secs();
                        format_timestamp(secs)
                    });
                ArtifactInfo {
                    name: name.to_string(),
                    status: status.to_string(),
                    path: file_path.to_string_lossy().to_string(),
                    last_modified,
                }
            }
        })
        .collect()
}

fn count_tasks(tasks_path: &Path) -> (u32, u32) {
    use std::fs;

    if let Ok(content) = fs::read_to_string(tasks_path) {
        let total = content.matches("- [ ]").count() + content.matches("- [x]").count();
        let completed = content.matches("- [x]").count();
        (total as u32, completed as u32)
    } else {
        (0, 0)
    }
}

fn read_profile(openspec_path: &Path) -> String {
    use std::fs;

    let config_path = openspec_path.join("config.json");
    if let Ok(content) = fs::read_to_string(config_path) {
        if let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
            return json
                .get("profile")
                .and_then(|v| v.as_str())
                .unwrap_or("core")
                .to_string();
        }
    }
    "core".to_string()
}

fn read_dir_tree(path: &Path) -> Vec<SpecFile> {
    use std::fs;

    let mut result = vec![];
    if let Ok(entries) = fs::read_dir(path) {
        let mut sorted: Vec<_> = entries.flatten().collect();
        sorted.sort_by_key(|e| {
            let is_file = e.path().is_file();
            (is_file, e.file_name())
        });
        for entry in sorted {
            let entry_path = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();
            let last_modified = entry_path
                .metadata()
                .ok()
                .and_then(|m| m.modified().ok())
                .map(|t| {
                    let secs = t
                        .duration_since(std::time::UNIX_EPOCH)
                        .unwrap_or_default()
                        .as_secs();
                    format_timestamp(secs)
                });

            if entry_path.is_dir() {
                result.push(SpecFile {
                    name: name.clone(),
                    path: entry_path.to_string_lossy().to_string(),
                    is_directory: true,
                    children: Some(read_dir_tree(&entry_path)),
                    last_modified,
                });
            } else {
                result.push(SpecFile {
                    name,
                    path: entry_path.to_string_lossy().to_string(),
                    is_directory: false,
                    children: None,
                    last_modified,
                });
            }
        }
    }
    result
}

fn format_timestamp(secs: u64) -> String {
    let days = secs / 86400;
    let epoch_days = days as i64 - 719528;
    let year = 1970 + epoch_days / 365;
    format!("{}-01-01T00:00:00Z", year)
}

#[tauri::command]
pub async fn write_artifact(path: String, content: String) -> Result<(), String> {
    use std::fs;

    let file_path = Path::new(&path);
    if let Some(parent) = file_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directories for {}: {}", path, e))?;
    }
    fs::write(&path, content)
        .map_err(|e| format!("Failed to write file {}: {}", path, e))
}

#[tauri::command]
pub async fn read_archived_changes(path: String) -> Result<Vec<ChangeInfo>, String> {
    use std::fs;

    let workspace_path = Path::new(&path);
    let archive_path = workspace_path.join("openspec").join("changes").join("archive");

    if !archive_path.exists() {
        return Ok(vec![]);
    }

    let mut changes: Vec<ChangeInfo> = vec![];
    if let Ok(entries) = fs::read_dir(&archive_path) {
        for entry in entries.flatten() {
            let entry_path = entry.path();
            if entry_path.is_dir() {
                let name = entry.file_name().to_string_lossy().to_string();
                let artifacts = scan_artifacts(&entry_path);
                let (tasks_total, tasks_completed) =
                    count_tasks(&entry_path.join("tasks.md"));

                let created_at = entry_path
                    .metadata()
                    .ok()
                    .and_then(|m| m.created().ok())
                    .map(|t| {
                        let secs = t
                            .duration_since(std::time::UNIX_EPOCH)
                            .unwrap_or_default()
                            .as_secs();
                        format_timestamp(secs)
                    })
                    .unwrap_or_else(|| "unknown".to_string());

                changes.push(ChangeInfo {
                    id: name.clone(),
                    name: name.clone(),
                    status: "archived".to_string(),
                    schema: "core".to_string(),
                    created_at,
                    artifacts,
                    tasks_total,
                    tasks_completed,
                    column: "draft".to_string(),
                });
            }
        }
    }

    // Sort by name descending (date prefix means newest first)
    changes.sort_by(|a, b| b.name.cmp(&a.name));

    Ok(changes)
}

#[tauri::command]
pub async fn read_tasks(path: String) -> Result<TasksData, String> {
    use std::fs;

    let file_path = Path::new(&path);
    if !file_path.exists() {
        return Err(format!("File not found: {}", path));
    }

    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file {}: {}", path, e))?;

    let lines: Vec<&str> = content.split('\n').collect();
    let mut tasks: Vec<TaskInfo> = Vec::new();
    let mut current_layer: Option<String> = None;
    let mut task_counter: u32 = 0;

    for (line_index, line) in lines.iter().enumerate() {
        // Detect layer headings (## Layer Name)
        if let Some(layer_match) = line.trim_start().strip_prefix("## ") {
            current_layer = Some(layer_match.trim().to_string());
            continue;
        }

        // Match task lines: - [ ] or - [x]
        if let Some(task_match) = line.match_indices("- [").next() {
            let rest = &line[task_match.0..];
            let done = rest.starts_with("- [x]") || rest.starts_with("- [X]");
            // Extract label after checkbox
            if let Some(label_start) = rest.find("] ") {
                let label = rest[label_start + 2..].trim().to_string();
                let layer_name = current_layer.clone();
                tasks.push(TaskInfo {
                    id: format!("task-{}", task_counter),
                    label,
                    done,
                    line_index,
                    layer: layer_name,
                });
                task_counter += 1;
            }
        }
    }

    let total = tasks.len();
    let completed = tasks.iter().filter(|t| t.done).count();

    Ok(TasksData {
        tasks,
        total,
        completed,
    })
}

#[tauri::command]
pub async fn open_in_explorer(path: String) -> Result<(), String> {
    use std::process::Command;

    let folder_path = Path::new(&path);
    if !folder_path.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(folder_path)
            .spawn()
            .map_err(|e| format!("Failed to open explorer: {}", e))?;
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(folder_path)
            .spawn()
            .map_err(|e| format!("Failed to open finder: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(folder_path)
            .spawn()
            .map_err(|e| format!("Failed to open file manager: {}", e))?;
    }

    Ok(())
}
