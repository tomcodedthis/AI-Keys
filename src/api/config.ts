import { WebviewView } from "vscode"
import {
	ARGS_SUPPORTED,
	HF_MODEL_DEFAULT,
	MODELS_DEFAULT,
	MODEL_DEFAULT,
} from "../utils/configuration"
import { PromptConfig } from "../utils/types"
import { clearChat, log, notif } from "../utils/utils"
import { getArg, getModel } from "./process/get"
import { processArg, removeArg } from "./process/process"
import { setModel } from "./process/set"
import { clarifaiRequest } from "./providers/clarifai"
import { huggingFaceRequest } from "./providers/huggingFace"
import { getModels } from "./providers/models"
import { openaiRequest } from "./providers/openai"
import { supportedArg, supportedModel } from "./process/supported"

export async function config(prompt: PromptConfig, webview?: WebviewView) {
	const argArray = prompt.text.trim().split(" ").slice(0, 5)
	const models = (await getModels()) as string[]
	let provider = prompt.provider || MODELS_DEFAULT[MODEL_DEFAULT.toLowerCase()]
	let model = prompt.model || MODELS_DEFAULT[MODEL_DEFAULT.toLowerCase()]

	if (prompt.model) argArray.push(model)

	// from first 4 words, use the last occurance of a model or arg
	// to-do: multiple args

	if (!webview) {
		const isDefaultModel = await supportedModel(argArray, "default")
		const isOpenAIModel = await supportedModel(argArray, "openai")
		const isArgument = supportedArg(argArray)

		if (isDefaultModel) {
			provider = getModel(argArray)
			model = provider
			prompt.text = removeArg(
				Object.keys(MODELS_DEFAULT),
				prompt.text
			)
		}

		if (isOpenAIModel) {
			model = getModel(argArray, models)
			prompt.text = removeArg(models, prompt.text)
		}

		if (isArgument) {
			const arg = getArg(argArray)
			prompt.text = processArg(arg, prompt.text)

			if (ARGS_SUPPORTED.chatReset.some((supported) => {
					return supported === arg
				})
			) {
				clearChat()
				return
			}
		}
	}

	if (provider === "clarifai") {
		if (supportedArg(argArray)) {
			let args: string[] = []
			Object.values(ARGS_SUPPORTED).forEach((array) => (args = args.concat(array)))

			prompt.text = removeArg(args, prompt.text)
		}

		await clarifaiRequest(prompt.text, model, webview)
		return
	}

	if (provider === "huggingface") {
		//  Set model
		if (prompt.model) {
			await huggingFaceRequest(prompt.model, prompt, webview)
			return
		}
		
		if (supportedArg(argArray)) {
			const arg = getArg(argArray)

			if (arg === "model") {
				const newModel = argArray.slice(argArray.indexOf(arg)).filter((arg) => {
					return arg !== "="
				})[1]

				if (!newModel) {
					notif(`Please provide a new model for Hugging Face to use`)
					log("AI-Keys: No new model provided")
					return
				}

				setModel("huggingFace", newModel, "Hugging Face")
				await huggingFaceRequest(newModel, prompt, webview)
				return
			}
		}

		await huggingFaceRequest(HF_MODEL_DEFAULT, prompt, webview)
		return
	}

	model = getModel([model], models)

	await openaiRequest(model, prompt, webview)
}