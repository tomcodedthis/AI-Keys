import * as vscode from "vscode"

export function openSettings(setting: string) {
	vscode.commands
		.executeCommand(
			"workbench.action.openSettings",
			`${setting === "none" ? "aikeys" : setting}`
		)
		.then(() => {
			vscode.commands.executeCommand("workbench.action.openWorkspaceSettings")
		})
}
