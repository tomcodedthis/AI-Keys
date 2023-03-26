import { readFileSync } from "fs"
import HuggingFace from "huggingface"
import * as request from "request"
import { titleCase } from "title-case"
import * as vscode from "vscode"
import { HF_MODEL_DEFAULT } from "../../utils/configuration"
import { hfRequest, PromptConfig } from "../../utils/types"
import { log, notif, write } from "../../utils/utils"
import { validKey } from "../process/check"
import { processAPI } from "../process/process"

export async function huggingFaceRequest(modelName: string, prompt: PromptConfig) {
	const config = vscode.workspace.getConfiguration("AI-Keys")
	const key = config.get("keys.huggingface") as string

	if (!validKey(key)) return
	if (!modelName) return

	log(`Your final prompt: ${prompt.text}\nSent to: ${modelName}`)

	const hfInterface = processAPI(key, "huggingface") as HuggingFace

	let req = {
		model: HF_MODEL_DEFAULT,
		inputs: prompt.text,
	}

	return await startRequest(hfInterface, req, modelName, prompt.nextLine, key)
}

export async function startRequest(
	hf: HuggingFace,
	req: hfRequest,
	modelName: string,
	nextLine: number,
	key: string
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
					if (error || !res) {
						notif(`Hugging Face: ${error}`, 20)
						log(`AI-Keys: Hugging Face $${error}`)
						return
					}

					const modelType = res.body.pipeline_tag.toLowerCase()

					if (modelType === "text generation") {
						return await hf.textGeneration(req).then((res) => {
							write(res.generated_text, modelName, nextLine)
						})
					}

					if (modelType === "translation") {
						return await hf.translation(req).then((res) => {
							log(res)
							write(res.translation_text, modelName, nextLine)
						})
					}

					if (modelType === "automatic-speech-recognition") {
						const auidoReq = {
							model: req.model,
							data: readFileSync(req.inputs),
						}
						return await hf.automaticSpeechRecognition(auidoReq).then((res) => {
							write(titleCase(res.text), modelName, nextLine)
						})
					}

					notif(
						`AI-Keys: Either ${modelType} is not currently supported,\n or ${modelName} not recognised as a Hugging Face Model`
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
