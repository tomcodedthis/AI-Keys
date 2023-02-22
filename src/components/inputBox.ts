import * as vscode from "vscode"
import { hasConfig } from "../utils/utils"
import { checkInput } from "../api/check/checks"
import { withConfig, withoutConfig } from "../api/config/preConfig"

export async function showInputBox() {
	await vscode.window
		.showInputBox({
			title: "Enter Prompt",
			placeHolder: "What do you need me to do?",
		})
		.then(async (prompt) => {
			if (!checkInput(prompt) || !prompt) return
			prompt = prompt as string

			hasConfig(prompt) ? withConfig(prompt) : withoutConfig(prompt)
		})
}
