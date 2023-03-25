import * as vscode from "vscode"
import { go, log, notif } from "../../utils/utils"
import { getComment, getLanguage } from "./get"
import { isComment, validInput } from "./check"
import { PromptConfig } from "../../utils/types"
import { CreateImageRequest, Configuration, OpenAIApi, CreateCompletionRequest, CreateChatCompletionRequest } from "openai"
import { ARGS_SUPPORTED, COMMENT_SYMBOLS, CONVERT_DEFAULT } from "../../utils/configuration"

export function processLine() {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor
	const activeLine = editor.selection.active.line
	const lineNum = editor.document.lineAt(activeLine).lineNumber
	const maxLine = editor.document.lineCount

	let prompt: vscode.TextLine | string = editor.document.lineAt(activeLine).text
	let nextLine = editor.document.lineAt(lineNum)

	if (!validInput(prompt)) return
	if (isComment(prompt)) prompt = uncomment(prompt)
	if (nextLine.lineNumber + 1 < maxLine) {
		while (isComment(nextLine.text) && nextLine.lineNumber + 1 < maxLine) {
			nextLine = editor.document.lineAt(nextLine.lineNumber + 1)
			prompt += " \n" + uncomment(nextLine.text)
		}

		prompt += " \n" + uncomment(nextLine.text) + "\n"
	}

	const promptConfig: PromptConfig = {
		text: prompt.trim(),
		nextLine: nextLine.lineNumber,
	}

	return promptConfig
}

export function processAPI(key: string) {
	const configuration = new Configuration({ apiKey: key })
	const openai = new OpenAIApi(configuration)

	return openai
}

export function processError(
	err: any, 
	req?:
		CreateCompletionRequest |
		CreateImageRequest | 
		CreateChatCompletionRequest
	) {
	const badKey = [401, 404]
	const limit = [429]
	const servers = [500]
	let message = `AI-Keys: Check Request\n${req}\n`

	if (badKey.some((key) => { key === err.response.status })) {
		message = `AI-Keys: Invalid API Key\n`
		go("aikeys.keys", true)
	}

	if (limit.some((key) => { key === err.response.status })) message = "AI-Keys: OpenAI API Limit Reached\n"
	if (servers.some((key) => { key === err.response.status })) message = "AI-Keys: OpenAI Server Error\n"

	notif(message, 20)
	log(`AI-Keys: ${message}`)
}

export function processArg(arg: string, prompt: string) {
	const language = getLanguage() as string

	if (ARGS_SUPPORTED.op.some((phrase) => { return arg === phrase })) {
		prompt = prompt.replace(arg, "").trim()
		prompt = `refactor and optimize this ${language} code \n${prompt}`
	}

	if (ARGS_SUPPORTED.cv.some((phrase) => { return arg === phrase })) {
		let convertTo = CONVERT_DEFAULT
		Object.keys(COMMENT_SYMBOLS).some((lang) => {
			if (prompt.includes(lang)) {
				convertTo = lang
				prompt = prompt.replace(lang, "").trim()
				return true
			}
		})

		prompt = prompt.replace(arg, "").trim()
		prompt = `convert this from ${language} to ${convertTo} \n${prompt}`
	}

	if (ARGS_SUPPORTED.ex.some((phrase) => { return arg === phrase })) {
		prompt = prompt.replace(arg, "").trim()
		prompt = `explain this ${language} code \n${prompt}`
	}

	return prompt.trim()
}

export function removeArg(args: string[], prompt: string) {
	return prompt
		.split(" ")
		.filter((word) => {
			return !args.includes(word)
		})
		.join(" ")
		.trim()
}

export function uncomment(prompt: string) {
	const comment = getComment()

	if (prompt.includes(comment)) {
		prompt = prompt.replace(comment, "")
	}

	return prompt
}
