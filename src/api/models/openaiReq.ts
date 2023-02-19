import * as vscode from "vscode"
import { OpenAIRequest } from "../../utils/types"
import {
	FREQ_PEN_DEFAULT,
	MAX_TOKENS_DEFAULT,
	PRES_PEN_DEFAULT,
	TEMP_DEFAULT,
	TOP_P_DEFAULT,
} from "../../utils/defaults"
import { OpenAIApi } from "openai"
import { notif, log, sleep } from "../../utils/utils"
import { processError } from "../check/process"
import { checkAPI, checkArgs } from "../check/checks"

export async function openaiRequest(aiName: string, prompt: string, comment: string) {
	const openai = checkAPI() as OpenAIApi
	prompt = checkArgs(prompt)

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
	}

	if (req.model === "codex") {
		req.temperature =
			req.temperature !== 1 ? ((req.temperature - 1) * 2) / 10 : req.temperature
	}

	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `${aiName} is thinking of a respoonse...` as string,
			cancellable: false,
		},
		async () => {
			await openai
				.createCompletion(req)
				.then((response) => {
					const editor = vscode.window.activeTextEditor as vscode.TextEditor
					editor.edit((line) => {
						notif(`Here's what ${aiName} thinks` as string)

						const res = response.data.choices[0].text as string
						const words = res.split(" ")

						line.insert(editor.selection.end, "\n" + comment)

						if (res.length > 200) {
							let lineLetterLength = 200
	
							while (words.length > 0) {
								const word = words.shift() + " "
								if (!word) break
	
								lineLetterLength >= 0
									? line.insert(editor.selection.end, `${comment} ${word}`)
									: line.insert(editor.selection.end, `${comment} ${word} \n`)

								lineLetterLength -= word.length
								if (lineLetterLength <= 0) {
									lineLetterLength = 100
								}

								sleep(50)
							}
						} else {
							line.insert(
								editor.selection.end,
								response.data.choices[0].text as string
							)
						}
					})

					vscode.window.setStatusBarMessage("Here's what I know...", 5000)
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
