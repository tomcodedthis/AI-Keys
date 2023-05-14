import { readFileSync } from "fs"
import HuggingFace from "huggingface"
import * as request from "request"
import { titleCase } from "title-case"
import * as vscode from "vscode"
import { HF_MODEL_DEFAULT } from "../../utils/configuration"
import { HFRequest, PromptConfig } from "../../utils/types"
import { log, notif, updateChat, write } from "../../utils/utils"
import { validKey } from "../process/check"
import { processAPI } from "../process/process"

export async function huggingFaceRequest(
	modelName: string,
	prompt: PromptConfig,
	webview?: vscode.WebviewView
) {
	const config = vscode.workspace.getConfiguration("AI-Keys")
	const key = config.get("keys.huggingface") as string

	if (!validKey(key)) return
	if (!modelName) return

	log(`Your final prompt: ${prompt.text}, sent to: ${modelName}`)

	const hfInterface = processAPI(key, "huggingface") as HuggingFace

	const req = {
		model: HF_MODEL_DEFAULT,
		inputs: prompt.text,
	}

	updateChat([{ role: "user", content: prompt.text }])
	await startRequest(hfInterface, req, modelName, prompt.nextLine || 0, key, webview)
	return
}

export async function startRequest(
	hf: HuggingFace,
	req: HFRequest,
	modelName: string,
	nextLine: number,
	key: string,
	webview?: vscode.WebviewView
) {
	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `${titleCase(modelName)} is thinking of a response...`,
			cancellable: true,
		},
		async () => {
			try {
				const baseURL = `https://huggingface.co/api/models/${modelName}`
				const options = {
					url: baseURL,
					json: true,
					headers: {
						Authorization: key,
						"Content-Type": "application/json",
					},
				}

				request.get(options, async (error, res) => {
					if (error || res.body.error || !res) {
						notif(`Hugging Face: ${error ? error : res.body.error}`, 20)
						log(`AI-Keys: Hugging Face ${error ? error : res.body.error}`)
						return
					}

					const modelType = res.body.pipeline_tag.toLowerCase()

					if (modelType === "text-generation") {
						await hf
							.textGeneration(req)
							.then((res) => {
								write(res.generated_text, modelName, webview, nextLine)
								updateChat([{ role: "assistant", content: res.generated_text }])
							})
							.catch((error) => {
								notif(`Hugging Face Error: ${error}`, 20)
							})
						return
					}

					if (modelType === "translation") {
						await hf
							.translation(req)
							.then((res) => {
								write(res.translation_text, modelName, webview, nextLine)
								updateChat([{ role: "assistant", content: res.translation_text }])
							})
							.catch((error) => {
								notif(`Hugging Face Error: ${error}`, 20)
							})
						return
					}

					if (modelType === "automatic-speech-recognition") {
						const auidoReq = {
							model: req.model,
							data: readFileSync(req.inputs),
						}
						await hf
							.automaticSpeechRecognition(auidoReq)
							.then((res) => {
								write(titleCase(res.text), modelName, webview, nextLine)
								updateChat([{ role: "assistant", content: res.text }])
							})
							.catch((error) => {
								notif(`Hugging Face Error: ${error}`, 20)
							})
						return
					}

					notif(
						`AI-Keys: ${
							modelType
								? `${modelType} is not currently supported.`
								: `${modelName} not recognised as a Hugging Face Model`
						}`
					)
					log("AI-Keys: Unrecognised model")
					return
				})
			} catch (error) {
				notif(`Hugging Face Error: ${error}`, 20)
				log(`Hugging Face: ${error}`)
			}
		}
	)
}
