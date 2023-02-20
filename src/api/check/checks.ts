import { Configuration, OpenAIApi } from "openai"
import * as vscode from "vscode"
import { ARGS_SUPPORTED } from "../../utils/defaults"
import { notif } from "../../utils/utils"
import { getLanguage, getPrompt } from "../get/get"
import { keyExists, processArg } from "./process"

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

export function checkArgs(prompt: string) {
	const language = getLanguage() as string
	const optimise = ["op", "optimise", "optiimize"]
	const convert = ["cv", "convert"]
	const defaultPrompt = `${prompt}`

	if (!ARGS_SUPPORTED.some((arg) => prompt.includes(arg))) return defaultPrompt
	
	if (optimise.some((phrase) => { prompt.includes(phrase) })) {
		prompt = processArg(prompt, "op", `optimise this ${language} code `)
	} else if (convert.some((phrase) => { prompt.includes(phrase) })) {
		prompt = processArg(prompt, "cv", `convert this ${language} code to `)
	}

	return defaultPrompt
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