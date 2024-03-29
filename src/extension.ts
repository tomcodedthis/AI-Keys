import * as vscode from "vscode"
import { showInputBox } from "./components/inputBox"
import { config } from "./api/config"
import { PromptConfig } from "./utils/types"
import { processLine } from "./api/process/process"
import { activeEditor } from "./api/process/check"
import { clearChat, go, log, notif } from "./utils/utils"
import { listModels } from "./api/providers/models"
import { ChatWindow } from "./components/chat"

export function activate(context: vscode.ExtensionContext) {
	log("AIKeys: Activated")

	const provider = new ChatWindow(context.extensionUri)

	const settings = vscode.commands.registerCommand("aikeys.goToSettings", () => {
		notif("Opening settings", 5, "none")
		log("AI-Keys: Opening settings")
		go("none", true)
	})

	const sendLinePrompt = vscode.commands.registerCommand("aikeys.sendLinePrompt", async () => {
		const prompt = processLine() as PromptConfig
		if (!prompt) {
			await vscode.commands.executeCommand("aikeys.sendBoxPrompt")
			return
		}

		config(prompt)
	})

	const sendBoxPrompt = vscode.commands.registerCommand("aikeys.sendBoxPrompt", async () => {
		if (!activeEditor()) return
		await showInputBox()
	})

	const showModels = vscode.commands.registerCommand("aikeys.listModels", async () => {
		await listModels()
	})

	const resetChat = vscode.commands.registerCommand("aikeys.resetChat", async () => {
		clearChat()
	})

	const panel = vscode.window.registerWebviewViewProvider("aikeys.chat", provider)

	context.subscriptions.push(settings, sendLinePrompt, sendBoxPrompt, showModels, resetChat, panel)
}

export function deactivate() {
	log("AIKeys: Deactived")
}
