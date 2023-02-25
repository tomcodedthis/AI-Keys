import * as vscode from "vscode"
import { validInput } from "../api/process/check"
import { config } from "../api/config/config"

export async function showInputBox() {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor
	const activeLine = editor.selection.active.line

	await vscode.window
		.showInputBox({
			title: "Enter Prompt",
			placeHolder: "What do you need me to do?",
		})
		.then(async (prompt) => {
			if (!validInput(prompt) || !prompt) return

			config({
				text: prompt as string,
				nextLine: editor.document.lineAt(activeLine).lineNumber + 1,
			})
		})
}
