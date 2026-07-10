mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::open_folder_dialog,
            commands::read_workspace,
            commands::read_artifact,
            commands::run_openspec_command,
            commands::read_specs_tree,
            commands::open_in_explorer,
            commands::write_artifact,
            commands::read_tasks,
            commands::read_archived_changes,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
