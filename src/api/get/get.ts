import * as vscode from "vscode"
import { notif } from "../../utils/utils"
import { showInputBox } from "../../components/inputBox"
import { MODEL_DEFAULT, MODELS_SUPPORTED, COMMENT_SYMBOLS } from "../../utils/defaults"

export function getLanguage() {
	const editor = vscode.window.activeTextEditor
	if (!editor) {
		notif("I need a text editor to read from, or you could ask here", "none")
		showInputBox()
		return undefined
	}

	const language = vscode.window.activeTextEditor?.document.languageId

	return language
}

export function getModel(prompt: string) {
	const model = prompt.split(":")[1]
	const specificModel = MODELS_SUPPORTED.some((supported) => {
		if (model === supported || `${model}:` === supported) {
			return true
		}
	})

	if (!specificModel)
		notif("We don't support that model, switching to default", "none")

	return specificModel ? specificModel : MODEL_DEFAULT
}

export function getPrompt(prompt: vscode.TextLine) {
	if (prompt.isEmptyOrWhitespace || !prompt) {
		notif("Your prompt seems to be empty...", "none")
		vscode.commands.executeCommand("aikeys.sendBoxPrompt")
	}

	return prompt.text as string
}

export const currentComment = (prompt: string) => {
	for (const sym of COMMENT_SYMBOLS) {
		if (prompt.includes(sym)) {
			return sym
		}
	}
	return ""
}