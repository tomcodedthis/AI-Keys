import * as vscode from "vscode"
import { OpenAIApi } from "openai"
import { validKey } from "../process/check"
import { processAPI, processError } from "../process/process"
import { log, notif } from "../../utils/utils"
import { getComment } from "../process/get"

export async function listModels() {
	const config = vscode.workspace.getConfiguration("AI-Keys.keys")
	const key = config.get("openai") as string

	if (!validKey(key)) return

	const openai = processAPI(key) as OpenAIApi

	await openai
		.listModels()
		.then((res) => {
			notif(`Here's your list of availbe AI models` as string, 5)
			log("AI-Keys: Model list success")

			const editor = vscode.window.activeTextEditor as vscode.TextEditor
			const comment = getComment()
			let owners: { [key: string]: string[] } = { openai: [] }
			let text = ""

			res.data.data.forEach((model) => {
				if (!Object.keys(owners).includes(model.owned_by)) {
					owners[model.owned_by] = [`${model.id}, `]
					return
				}

				owners[model.owned_by].push(model.id)
			})

			Object.entries(owners).forEach((owner) => {
				let line = ""
				let temp = `\n${comment} `

				owner[1].forEach((model) => {
					if (temp.length <= 60) temp += `${model}, `
					if (temp.length > 60) {
						line += `${temp}`
						temp = `\n${comment} ${model}, `
					}
				})

				text += `\n\n${comment} Owned by ${owner[0]}:\n${line.trim()}`
			})

			editor.edit((line) => {
				line.insert(editor.selection.end, text)
			})
		})
		.catch((err) => {
			notif(`OpenAI Response: ${err.response.data.error.message}`, 20)
			processError(err.response.status)
		})
}

export async function getModels() {
	const config = vscode.workspace.getConfiguration("AI-Keys.keys")
	const key = config.get("openai") as string

	if (!validKey(key)) return

	const openai = processAPI(key) as OpenAIApi
	let models: string[] = [""]

	await openai
		.listModels()
		.then((res) => {
			log("AI-Keys: Model list success")

			res.data.data.forEach((model) => {
				models.push(model.id)
			})
		})
		.catch((err) => {
			notif(`OpenAI Response: ${err.response.data.error.message}`, 20)
			processError(err.response.status)
		})

	return models as string[]
}
