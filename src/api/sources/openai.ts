import * as vscode from "vscode"
import { OpenAIRequest, PromptConfig } from "../../utils/types"
import { FREQ_PEN_DEFAULT, IMAGE_COUNT_DEFAULT, MAX_TOKENS_DEFAULT, PRES_PEN_DEFAULT, TEMP_DEFAULT, TOP_P_DEFAULT } from "../../utils/defaults"
import { CreateImageRequest, OpenAIApi } from "openai"
import { notif, log, download } from "../../utils/utils"
import { processAPI, processError } from "../process/process"
import { getComment } from "../process/get"
import { titleCase } from "title-case"
import { validKey } from "../process/check"

export async function openaiRequest(aiName: string, prompt: PromptConfig) {
	const config = vscode.workspace.getConfiguration("AI-Keys.keys")
	const key = config.get("openai") as string

	if (!validKey(key)) return
	if (!aiName) return

	log(`Your final prompt: ${prompt.text}\nSent to: ${aiName}`)

	const openai = processAPI(key) as OpenAIApi
	const req: OpenAIRequest = {
		model: aiName,
		prompt: prompt.text,
		temperature: TEMP_DEFAULT,
		max_tokens: MAX_TOKENS_DEFAULT,
		top_p: TOP_P_DEFAULT,
		frequency_penalty: FREQ_PEN_DEFAULT,
		presence_penalty: PRES_PEN_DEFAULT,
		stream: false,
	}

	if (aiName === "dalle") {
		return await imageRequest(openai, prompt.text, aiName)
	}

	return await textRequest(openai, req, aiName, prompt.nextLine)
}

export async function textRequest(openai: OpenAIApi, req: OpenAIRequest, aiName: string, nextLine: number) {
	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `${titleCase(aiName)} is thinking of a response...` as string,
			cancellable: false,
		},
		async () => {
			await openai
				.createCompletion(req)
				.then((response) => {
					notif(`Here's what ${titleCase(aiName)} thinks` as string, 5)
					log("AI-Keys: Response Success")

					const editor = vscode.window.activeTextEditor as vscode.TextEditor
					const res = response.data.choices[0].text as string
					const comment = getComment()
					let lineLength = 0
					
					const text = res.split("").slice(1).map((letter) => {
						lineLength += letter.length

						if (lineLength > 80 && letter === " ") {
							letter = `\n${comment} `
							lineLength = 0
						}

						return letter === `\n` ? `${letter}${comment} ` : letter
					})

					editor.edit((editBulder) => {
						editBulder.insert(new vscode.Position(nextLine, 0), `\n${comment} ${text.join("")}\n`)
					})
				})
				.catch((err) => {
					notif(`OpenAI Response: ${err.response.data.error.message}`, 20)
					processError(err.status, req)
				})
		}
	)
}

export async function imageRequest(openai: OpenAIApi, prompt: string, aiName: string) {
	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `${titleCase(aiName)} is thinking of a response...` as string,
			cancellable: false,
		},
		async () => {
			const req: CreateImageRequest = {
				prompt: prompt,
				n: IMAGE_COUNT_DEFAULT,
				size: "256x256",
			}
			await openai
				.createImage(req)
				.then(async (response) => {
					const editor = vscode.window.activeTextEditor as vscode.TextEditor
					const res = response.data.data[0].url as string
					const comment = getComment()

					await download(res, prompt).then(() => {
						editor.edit((line) => {
							line.insert(editor.selection.end, `\n\n${comment} Image URL link:\n${comment} ${res}`)
						})

						notif(`Here's your ${aiName.toUpperCase()} image` as string, 5)
						log("AI-Keys: Response Success")
					})
				})
				.catch((err) => {
					processError(err.response.status, req)
					notif("OpenAI Response: " + err.response.data.error.message, 20)
					log(err.response)
				})
		}
	)
}
