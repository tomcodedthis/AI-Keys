import * as vscode from "vscode"
import * as fs from "fs"
import { log, notif } from "../../utils/utils"
import {
	MODEL_DEFAULT,
	COMMENT_SYMBOLS,
	MODELS_DEFAULT,
	ARGS_SUPPORTED,
} from "../../utils/configuration"
import { titleCase } from "title-case"

export function getPrompt(prompt: vscode.TextLine) {
	if (prompt.isEmptyOrWhitespace || !prompt) {
		notif("AI-Keys: Your prompt seems to be empty...")
		log("AI-Keys: No prompt")

		vscode.commands.executeCommand("aikeys.sendBoxPrompt")
	}

	return prompt.text as string
}

export function getLanguage() {
	const editor = vscode.window.activeTextEditor
	if (!editor) return

	return editor.document.languageId
}

export const getComment = () => {
	const language = getLanguage()

	for (const [key, value] of Object.entries(COMMENT_SYMBOLS)) {
		if (key === language) return value
	}

	return "//"
}

export function getModel(promptArray: string[], fullList = [""]) {
	const modelDefault = MODELS_DEFAULT[MODEL_DEFAULT.toLowerCase()]
	let model = ""

	promptArray.some((word) => {
		word = word.toLowerCase()

		if (fullList.includes(word)) model = word
		if (Object.keys(MODELS_DEFAULT).includes(word)) model = MODELS_DEFAULT[word]
	})

	if (model.length > 0) return model

	notif(`AI-Keys: Unrecognised model, switching to default ${titleCase(modelDefault)}`)
	log(`AI-Keys: Model not recognised`)

	return modelDefault
}

export function getArg(promptArray: string[]) {
	return promptArray
		.filter((word) => {
			if (Object.values(ARGS_SUPPORTED).some((argArray) => argArray.includes(word))) return word
		})
		.join("")
}

export function getLocalImage(prompt: string) {
	return fs.readFileSync(prompt, "base64")
}
