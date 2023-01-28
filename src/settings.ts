import * as vscode from "vscode";

export function openSettings() {
  vscode.commands
    .executeCommand("workbench.action.openSettings", "AIKeys")
    .then(() => {
      vscode.commands.executeCommand("workbench.action.openWorkspaceSettings");
    });
}
