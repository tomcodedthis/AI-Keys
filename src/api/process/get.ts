import * as vscode from "vscode"
import { log, notif } from "../../utils/utils"
import { MODEL_DEFAULT, COMMENT_SYMBOLS, MODELS_DEFAULT, ARGS_SUPPORTED, CONVERT_DEFAULT } from "../../utils/defaults"

export function getPrompt(prompt: vscode.TextLine) {
	if (prompt.isEmptyOrWhitespace || !prompt) {
		notif("Your prompt seems to be empty...")
		log("AI-Keys: No prompt")

		vscode.commands.executeCommand("aikeys.sendBoxPrompt")
	}

	return prompt.text as string
}

export function getLanguage() {
	const editor = vscode.window.activeTextEditor
	if (!editor) {
		log("AI-Keys: No text editor")
		return
	}

	return editor.document.languageId
}

export const getComment = () => {
	const language = getLanguage()

	for (const [key, value] of Object.entries(COMMENT_SYMBOLS)) {
		if (key == language) return value
	}

	return "//"
}

export function getModel(promptArray: string[], fullList: string[]) {
	let model = ""
	
	promptArray.some(word => {
		if (fullList.includes(word)) model = word
		if (Object.keys(MODELS_DEFAULT).includes(word)) model = MODELS_DEFAULT[word]
	})

	if (model.length > 0) return model

	notif(`Unrecognised model, switching to default ${MODELS_DEFAULT[MODEL_DEFAULT]}`)
	log(`Model not recognised`)

	return MODELS_DEFAULT[MODEL_DEFAULT]
}

export function getArg(promptArray: string[], prompt: string) {
	const language = getLanguage() as string
	let arg = promptArray.map(word => {
		if (Object.values(ARGS_SUPPORTED).some(argArray => 
				argArray.includes(word))) return word
	}).join("")

	if (ARGS_SUPPORTED.op.some(phrase => { return arg === phrase })) {
		prompt = prompt.replace(arg, "").trim()
		prompt = `refactor and optimize this ${language} code \n${prompt}`
	}

	if (ARGS_SUPPORTED.cv.some(phrase => { return arg === phrase })) {
		let convertTo = CONVERT_DEFAULT;
		Object.keys(COMMENT_SYMBOLS).some(lang => {
			if (prompt.includes(lang)) {
				convertTo = lang
				prompt = prompt.replace(lang, "").trim()
				return true
			}
		})

		prompt = prompt.replace(arg, "").trim()
		prompt = `convert this from ${language} to ${convertTo} \n${prompt}`
	}

	if (ARGS_SUPPORTED.ex.some(phrase => { return arg === phrase })) {
		prompt = prompt.replace(arg, "").trim()
		prompt = `explain this ${language} code \n${prompt}`
	}

	return prompt.trim()

	// return prompt
	// 	.split(" ")
	// 	// .filter(word => { return word !== arg })
	// 	.join(" ")
}

export function addArg(arg: string, prompt: string) {
	const language = getLanguage() as string

	if (!Object.values(ARGS_SUPPORTED).some((val) => { return val.some((phrase) => { return arg === phrase })}) ) {
		notif("Invalid argument, using default settings.\nCheck AI-Keys list of suported arguments.")
		log("AI-Keys: Invalid prompt argument")
		
		return prompt
	}

	if (ARGS_SUPPORTED.op.some(phrase => { return arg === phrase })) {
		prompt = prompt.replace(arg, "").trim()
		prompt = `refactor and optimize this ${language} code \n${prompt}`
	}

	if (ARGS_SUPPORTED.cv.some(phrase => { return arg === phrase })) {
		let convertTo = CONVERT_DEFAULT;
		Object.keys(COMMENT_SYMBOLS).some(lang => {
			if (prompt.includes(lang)) {
				convertTo = lang
				prompt = prompt.replace(lang, "").trim()
				return true
			}
		})

		prompt = prompt.replace(arg, "").trim()
		prompt = `convert this from ${language} to ${convertTo} \n${prompt}`
	}

	if (ARGS_SUPPORTED.ex.some(phrase => { return arg === phrase })) {
		prompt = prompt.replace(arg, "").trim()
		prompt = `explain this ${language} code \n${prompt}`
	}

	return prompt.trim()
}