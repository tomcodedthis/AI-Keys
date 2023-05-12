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

export async function config(prompt: PromptConfig, webview?: WebviewView) {
	const argArray = prompt.text.trim().split(" ").slice(0, 5)
	const models = (await getModels()) as string[]
	let provider = MODELS_DEFAULT[MODEL_DEFAULT.toLowerCase()]
	let model =  MODELS_DEFAULT[MODEL_DEFAULT.toLowerCase()]

	if (prompt.model) argArray.push(prompt.model)

	// from first 4 words, use the last occurance of a model or arg
	// to-do: multiple args
	if (await supportedModel(argArray, "default")) {
		provider = getModel(argArray)
		model = provider
		prompt.text = removeArg(Object.keys(MODELS_DEFAULT), prompt.text)
	} else if (await supportedModel(argArray, "openai")) {
		model = getModel(argArray, models)
		prompt.text = removeArg(models, prompt.text)
	}

	if (webview && prompt.model && prompt.provider) {
		provider = prompt.provider
		model = prompt.model
		console.log(`Provider: ${provider}\nModel: ${model}`)
	}

	if (!webview &&	supportedArg(argArray)) {
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
				return
			}
		}

		await huggingFaceRequest(HF_MODEL_DEFAULT, prompt, webview)
		return
	}

	await openaiRequest(model, prompt, webview)
}

export async function supportedModel(promptArray: string[], check: string) {
	if (check === "default") {
		return promptArray.some(
			(word) => Object.keys(MODELS_DEFAULT).includes(word))
	}

	if (check === "openai") {
		const models = (await getModels()) as string[]
		return promptArray.some((word) => models.includes(word))
	}

	return false
}

export function supportedArg(promptArray: string[]) {
	if (
		promptArray.some((word) =>
			Object.values(ARGS_SUPPORTED).some((argArray) => argArray.includes(word))
		)
	)
		return true
	return false
}
