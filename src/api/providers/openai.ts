import * as vscode from "vscode"
import { PromptConfig } from "../../utils/types"
import {
	CHAT_LOG,
	CHAT_SYSTEM_DEFAULT,
	FREQ_PEN_DEFAULT,
	GPT_TURBO_MODELS,
	IMAGE_COUNT_DEFAULT,
	IMAGE_SIZE_DEFAULT,
	MAX_TOKENS_DEFAULT,
	PRES_PEN_DEFAULT,
	TEMP_DEFAULT,
	TOKEN_WARN_LIMIT,
	TOP_P_DEFAULT,
} from "../../utils/configuration"
import {
	OpenAIApi,
	CreateCompletionRequest,
	CreateImageRequest,
	CreateImageRequestSizeEnum,
	CreateChatCompletionRequest,
	ChatCompletionRequestMessage,
	ChatCompletionResponseMessage,
} from "openai"
import { notif, log, download, write } from "../../utils/utils"
import { processAPI, processError } from "../process/process"
import { getComment } from "../process/get"
import { titleCase } from "title-case"
import { validKey } from "../process/check"

export async function openaiRequest(aiName: string, prompt: PromptConfig) {
	const config = vscode.workspace.getConfiguration("AI-Keys")
	const key = config.get("keys.openai") as string

	if (!validKey(key)) return
	if (!aiName) return

	log(`Your final prompt: ${prompt.text}\nSent to: ${aiName}`)

	const openai = processAPI(key) as OpenAIApi

	if (aiName === "dalle") {
		return await imageRequest(openai, prompt.text, aiName)
	}

	let req = {
		model: aiName,
		temperature: TEMP_DEFAULT,
		max_tokens: MAX_TOKENS_DEFAULT,
		top_p: TOP_P_DEFAULT,
		frequency_penalty: FREQ_PEN_DEFAULT,
		presence_penalty: PRES_PEN_DEFAULT,
		stream: false,
	}

	if (GPT_TURBO_MODELS.some((model) => model === aiName)) {
		const prevMsgs = config.get("openAI.messages") as ChatCompletionRequestMessage[]
		let chatReq: CreateChatCompletionRequest

		if (!prevMsgs || prevMsgs.length === 0) {
			chatReq = {
				...req,
				messages: [
					{ role: "system", content: CHAT_SYSTEM_DEFAULT },
					{ role: "user", content: prompt.text as string },
				],
			}
		} else {
			chatReq = {
				...req,
				messages: [...prevMsgs, { role: "user", content: prompt.text as string }],
			}
		}

		updateChat(chatReq.messages)

		return await chatRequest(openai, chatReq, aiName, prompt.nextLine)
	}

	let textReq: CreateCompletionRequest = {
		...req,
		prompt: prompt.text,
	}

	return await textRequest(openai, textReq, aiName, prompt.nextLine)
}

export async function chatRequest(
	openai: OpenAIApi,
	req: CreateChatCompletionRequest,
	aiName: string,
	nextLine: number
) {
	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `${titleCase(aiName)} is thinking of a response...`,
			cancellable: true,
		},
		async () => {
			await openai
				.createChatCompletion(req)
				.then((response) => {
					const res = response.data.choices[0].message?.content as string

					write(res, aiName, nextLine)

					const config = vscode.workspace.getConfiguration("AI-Keys")
					const prevMsgs = config.get("openAI.messages") as ChatCompletionRequestMessage[]

					updateChat([
						...prevMsgs,
						response.data.choices[0].message as ChatCompletionResponseMessage,
					])

					if ((response.data.usage?.total_tokens as number) > TOKEN_WARN_LIMIT) {
						notif(
							`AI-Keys: ${response.data.usage?.total_tokens as number} Tokens used for prompt.` +
								` Reset your chat with the prompt clearChat, to reduce token usage`,
							10
						)
					}
				})
				.catch((error) => {
					notif(`OpenAI Error: ${error.response.data.error.message}`, 20)
					log(`OpenAI Error: ${error.response.status}`)
					processError(error.status, req)
				})
		}
	)
}

export async function textRequest(
	openai: OpenAIApi,
	req: CreateCompletionRequest,
	aiName: string,
	nextLine: number
) {
	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `${titleCase(aiName)} is thinking of a response...`,
			cancellable: true,
		},
		async () => {
			await openai
				.createCompletion(req)
				.then((response) => {
					const res = response.data.choices[0].text as string
					write(res, aiName, nextLine)
				})
				.catch((error) => {
					notif(`OpenAI Error: ${error.response.data.error.message}`, 20)
					log(`OpenAI Error: ${error.response.status}`)
					processError(error.status, req)
				})
		}
	)
}

export async function imageRequest(openai: OpenAIApi, prompt: string, aiName: string) {
	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `${titleCase(aiName)} is thinking of a response...`,
			cancellable: true,
		},
		async () => {
			const req: CreateImageRequest = {
				prompt: prompt,
				n: IMAGE_COUNT_DEFAULT,
				size: IMAGE_SIZE_DEFAULT as CreateImageRequestSizeEnum,
			}

			await openai
				.createImage(req)
				.then(async (response) => {
					const editor = vscode.window.activeTextEditor as vscode.TextEditor
					const res = response.data.data[0].url as string
					const comment = getComment()

					await download(res, prompt).then(() => {
						notif(`Here's your ${aiName.toUpperCase()} image` as string, 5)
						log("AI-Keys: Response Success")

						editor.edit((line) => {
							line.insert(editor.selection.end, `\n\n${comment} Image URL link:\n${comment} ${res}`)
						})
					})
				})
				.catch((error) => {
					notif(`OpenAI Error: ${error.response.data.error.message}`, 20)
					log(`OpenAI Error: ${error.response.status}`)
					processError(error.response.status, req)
				})
		}
	)
}

export function updateChat(entry: ChatCompletionRequestMessage[] | ChatCompletionResponseMessage) {
	const config = vscode.workspace.getConfiguration("AI-Keys")
	config.update("openAI.messages", entry)
}

export function clearChat() {
	const config = vscode.workspace.getConfiguration("AI-Keys")
	config.update("openAI.messages", [])

	notif(`AI-Keys: GPT Chat cleared`, 5)
}
