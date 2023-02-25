import * as vscode from "vscode"
import { go, log, notif } from "../../utils/utils"
import { getComment } from "./get"
import { isComment, validInput } from "./check"
import { OpenAIRequest, PromptConfig } from "../../utils/types"
import { CreateImageRequest, Configuration, OpenAIApi } from "openai"

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function processError(err: any, req?: OpenAIRequest | CreateImageRequest) {
	const badKey = [401, 404]
	const limit = [429]
	const servers = [500]
	let message = `AI-Keys: Check Request\n${req}\n`;

	if (badKey.some((key) => { key === err.response.status })) {
		message = `AI-Keys: Invalid API Key\n`
		go("aikeys.keys", true)
	}
	if (limit.some((key) => { key === err.response.status })) message = "AI-Keys: OpenAI API Limit Reached\n"
	if (servers.some((key) => { key === err.response.status })) message = "AI-Keys: OpenAI Server Error\n"
	
	notif(message, 20)
	log(`AI-Keys: ${message}`)
}

export function uncomment(prompt: string) {
	const comment = getComment()

	if (prompt.includes(comment)) {
		prompt = prompt.replace(comment, "")
	}

	return prompt
}
