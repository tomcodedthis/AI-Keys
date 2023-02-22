import { Configuration, OpenAIApi } from "openai"
import * as vscode from "vscode"
import { notif } from "../../utils/utils"
import { getPrompt } from "../get/get"
import { keyExists } from "./process"

export function checkLine() {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor
	const line = editor.selection.active.line
	let prompt: vscode.TextLine | string = editor.document.lineAt(line)

	prompt = getPrompt(prompt)

	if (!checkInput(prompt)) return

	return prompt
}

export function checkInput(prompt: string | undefined) {
	if (!prompt || prompt.trim().length === 0) {
		notif("You didn't enter a prompt", "none")
		return false
	}

	if (prompt.trim().length === 1) {
		notif("Prompt must be  longer than 1 character", "none")
		return false
	}

	return true
}

export function checkAPI() {
	const config = vscode.workspace.getConfiguration("AI-Keys.keys")
	const key = config.get("openai") as string

	if (!keyExists(key)) {
		notif("I need a key to start...", "aikeys.keys")
		return false
	}

	const configuration = new Configuration({ apiKey: key })
	const openai = new OpenAIApi(configuration)

	return openai
}