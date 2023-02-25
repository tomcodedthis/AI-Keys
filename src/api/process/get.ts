import * as vscode from "vscode"
import { log, notif } from "../../utils/utils"
import { MODEL_DEFAULT, MODELS_SUPPORTED, COMMENT_SYMBOLS } from "../../utils/defaults"

export function getLanguage() {
	const editor = vscode.window.activeTextEditor
	if (!editor) {
		log("AI-Keys: No text editor")
		return
	}

	return editor.document.languageId
}

export function getModel(prompt: string) {
	const model = prompt.split(":")[1]
	const specificModel = MODELS_SUPPORTED.some((supported) => {
		if (model === supported || `${model}:` === supported) {
			return true
		}
	})

	if (!specificModel) notif("We don't support that model, switching to default")

	return specificModel ? specificModel : MODEL_DEFAULT
}

export function getPrompt(prompt: vscode.TextLine) {
	if (prompt.isEmptyOrWhitespace || !prompt) {
		notif("Your prompt seems to be empty...")
		log("AI-Keys: No prompt")

		vscode.commands.executeCommand("aikeys.sendBoxPrompt")
	}

	return prompt.text as string
}

export const getComment = () => {
	const language = getLanguage()

	for (const [key, value] of Object.entries(COMMENT_SYMBOLS)) {
		if (key == language) return value
	}

	return "//"
}
