import * as vscode from "vscode"
import { OpenAIRequest } from "../../utils/types"
import {
	FREQ_PEN_DEFAULT,
	IMAGE_COUNT_DEFAULT,
	IMAGE_SIZE_DEFAULT,
	MAX_TOKENS_DEFAULT,
	PRES_PEN_DEFAULT,
	TEMP_DEFAULT,
	TOP_P_DEFAULT,
} from "../../utils/defaults"
import { OpenAIApi } from "openai"
import { notif, log, download } from "../../utils/utils"
import { processError } from "../check/process"
import { checkAPI, checkArgs } from "../check/checks"
import { getComment } from "../get/get"

export async function openaiRequest(aiName: string, prompt: string) {
	const openai = checkAPI() as OpenAIApi
	prompt = checkArgs(prompt).trim()

	const req: OpenAIRequest = {
		model:
			aiName.toLowerCase() === "codex"
				? "code-davinci-002"
				: "text-davinci-003",
		prompt: prompt,
		temperature: TEMP_DEFAULT,
		max_tokens: MAX_TOKENS_DEFAULT,
		top_p: TOP_P_DEFAULT,
		frequency_penalty: FREQ_PEN_DEFAULT,
		presence_penalty: PRES_PEN_DEFAULT,
		stream: false,
	}

	if (req.model === "codex") { req.temperature = req.temperature / 2 }

	if (aiName.toLowerCase() === "dalle") { return await imageRequest(openai, prompt, aiName.toLowerCase()) }

	return await textRequest(openai, req, aiName)
}

export async function textRequest(openai: OpenAIApi, req: OpenAIRequest, aiName: string) {
	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `${aiName.toUpperCase()} is thinking of a respoonse...` as string,
			cancellable: false,
		},
		async () => {
			log(req)

			await openai
				.createCompletion(req)
				.then((response) => {
					notif(`Here's what ${aiName.toUpperCase()} thinks` as string)
					const editor = vscode.window.activeTextEditor as vscode.TextEditor
					const res = response.data.choices[0].text as string
					const comment = getComment()

					editor.edit((line) => {
						const text = res.split('').map((letter) => {
							return letter == `\n`
								? letter += `${comment} `
								: letter
						})

						line.insert(editor.selection.end, `\n${comment} ${text.join('')}`)
					})
				})
				.catch((err) => {
					notif(
						"OpenAI response: " + err.response.data.error.message,
						"aikeys.keys",
						60
					)
					processError(err.response.status)
					log(err.response)
				})
		}
	)
}

export async function imageRequest(openai: OpenAIApi, prompt: string, aiName: string) {
	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `${aiName.toUpperCase()} is thinking of a respoonse...` as string,
			cancellable: false,
		},
		async () => {
			await openai
				.createImage({
					prompt: prompt,
					n: IMAGE_COUNT_DEFAULT,
					size: IMAGE_SIZE_DEFAULT
				})
				.then(async (response) => {
					const editor = vscode.window.activeTextEditor as vscode.TextEditor
					const res = response.data.data[0].url as string
					const comment = getComment()

					await download(res, prompt).then(() => {
						editor.edit((line) => {
							line.insert(editor.selection.end, `\n${comment} Also available here:\n${comment} ${res}`)
						})
	
						notif(`Here's your ${aiName.toUpperCase()} image` as string)
					})
				})
				.catch((err) => { log(err) })
		}
	)
}
