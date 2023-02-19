import * as vscode from "vscode"
import { openSettings } from "./navigation/settings"
import { showInputBox } from "./components/inputBox"
import { hasConfig } from "./utils/utils"
import { checkLine } from "./api/check/checks"
import { textEditor } from "./api/check/process"
import {
	searchWithConfig,
	searchWithoutConfig,
} from "./api/config/promptConfig"

export function activate(context: vscode.ExtensionContext) {
	console.log("AIKeys actived")

	const settings = vscode.commands.registerCommand(
		"aikeys.goToSettings",
		() => {
			vscode.window.showInformationMessage("Going to settings...")
			openSettings("none")
		}
	)

	const sendLinePrompt = vscode.commands.registerCommand(
		"aikeys.sendLinePrompt",
		async () => {
			const prompt = checkLine()

			if (!prompt) {
				await vscode.commands.executeCommand("aikeys.sendBoxPrompt")
				return
			}

			hasConfig(prompt) ? searchWithConfig(prompt) : searchWithoutConfig(prompt)
		}
	)

	const sendBoxPrompt = vscode.commands.registerCommand(
		"aikeys.sendBoxPrompt",
		async () => {
			if (!textEditor()) return
			await showInputBox()
		}
	)

	context.subscriptions.push(settings, sendLinePrompt, sendBoxPrompt)
}

export function deactivate() {
	vscode.window.showInformationMessage("AIKeys deactived")
}
