use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use std::process::Command;
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

#[tauri::command]
pub async fn open_folder_dialog(app: AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;
    let folder = app.dialog().file().blocking_pick_folder();
    Ok(folder.map(|p| p.to_string()))
}

#[tauri::command]
pub async fn read_workspace(path: String) -> Result<WorkspaceData, String> {
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
                    // Skip 'archive' directory - it stores completed changes
                    if name == "archive" {
                        continue;
                    }
                    // Skip empty folders (no .md files inside)
                    let has_content = fs::read_dir(&entry_path)
                        .map(|entries| entries.flatten().any(|e| {
                            e.path().extension().map(|ext| ext == "md" || ext == "yaml").unwrap_or(false)
                        }))
                        .unwrap_or(false);
                    if !has_content {
                        continue;
                    }
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
                        status: "active".to_string(),
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

#[tauri::command]
pub async fn read_artifact(path: String) -> Result<String, String> {
    eprintln!("DEBUG: read_artifact called with path: {}", path);
    let file_path = Path::new(&path);
    
    if !file_path.exists() {
        eprintln!("DEBUG: File does not exist: {}", path);
        return Err(format!("File not found: {}", path));
    }
    if file_path.is_dir() {
        // It's a directory — try spec.md inside it automatically
        let spec_path = file_path.join("spec.md");
        eprintln!("DEBUG: Path is a directory, trying: {:?}", spec_path);
        return match fs::read_to_string(&spec_path) {
            Ok(content) => Ok(content),
            Err(e) => Err(format!("spec.md not found in {}: {}", path, e)),
        };
    }

    match fs::read_to_string(&path) {
        Ok(content) => {
            eprintln!("DEBUG: Successfully read {} bytes from {}", content.len(), path);
            Ok(content)
        }
        Err(e) => {
            eprintln!("DEBUG: Failed to read artifact: {} (error: {})", path, e);
            Err(format!("Failed to read file: {} ({})", path, e))
        }
    }
}

#[tauri::command]
pub async fn run_openspec_command(
    cmd: String,
    args: Vec<String>,
    cwd: Option<String>,
) -> Result<CommandResult, String> {
    let mut command = Command::new("openspec");
    command.arg(&cmd);
    for arg in &args {
        command.arg(arg);
    }
    if let Some(dir) = cwd {
        command.current_dir(dir);
    }

    match command.output() {
        Ok(output) => Ok(CommandResult {
            stdout: String::from_utf8_lossy(&output.stdout).to_string(),
            stderr: String::from_utf8_lossy(&output.stderr).to_string(),
            exit_code: output.status.code().unwrap_or(-1),
        }),
        Err(e) => Err(format!("Failed to run openspec: {}", e)),
    }
}

#[tauri::command]
pub async fn read_specs_tree(workspace_path: String) -> Result<Vec<SpecFile>, String> {
    let specs_path = Path::new(&workspace_path).join("openspec").join("specs");
    eprintln!("DEBUG: Looking for specs at: {:?}", specs_path);
    if !specs_path.exists() {
        eprintln!("DEBUG: Specs path does not exist");
        return Ok(vec![]);
    }
    eprintln!("DEBUG: Found specs path, reading tree...");
    let tree = read_dir_tree(&specs_path);
    eprintln!("DEBUG: Found {} items in specs tree", tree.len());
    Ok(tree)
}

fn scan_artifacts(change_path: &Path) -> Vec<ArtifactInfo> {
    let artifact_names = ["proposal", "specs", "design", "tasks"];
    artifact_names
        .iter()
        .map(|name| {
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
        })
        .collect()
}

fn count_tasks(tasks_path: &Path) -> (u32, u32) {
    if let Ok(content) = fs::read_to_string(tasks_path) {
        let total = content.matches("- [ ]").count() + content.matches("- [x]").count();
        let completed = content.matches("- [x]").count();
        (total as u32, completed as u32)
    } else {
        (0, 0)
    }
}

fn read_profile(openspec_path: &Path) -> String {
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
pub async fn open_in_explorer(path: String) -> Result<(), String> {
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
