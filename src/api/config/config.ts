import { ARGS_SUPPORTED, MODELS_DEFAULT, MODEL_DEFAULT } from "../../utils/defaults"
import { PromptConfig } from "../../utils/types"
import { getArg, getModel } from "../process/get"
import { removeArg } from "../process/process"
import { clarifaiRequest } from "../sources/clarifai"
import { getModels } from "../sources/models"
import { openaiRequest } from "../sources/openai"

export async function config(prompt: PromptConfig) {
	const argArray = prompt.text.trim().split(" ").slice(0, 5)
	const models = await getModels() as string[]
	let model = MODELS_DEFAULT[MODEL_DEFAULT.toLowerCase()]

	// from first 4 words, use the last occurance of a model or arg
	// to-do: multiple args
	if (await supportedModel(argArray, "default")) {
		model = getModel(argArray)
		prompt.text = removeArg(argArray, prompt.text)
	} else if (await supportedModel(argArray, "openai")) {
		model = getModel(argArray, models)
		prompt.text = removeArg(argArray, prompt.text)
	}

	if (supportedArg(argArray)) {
		prompt.text = getArg(argArray, prompt.text)
	}

	if (model == "clarifai") {
		await clarifaiRequest()
		return
	}

	await openaiRequest(model, prompt)
}

export async function supportedModel(promptArray: string[], check: string) {
	if (check === "default") {
		return promptArray.some(word => Object.keys(MODELS_DEFAULT).includes(word))
	}

	if (check === "openai") {
		const models = await getModels() as string[]
		return promptArray.some(word => models.includes(word))
	}

	return false
}

export function supportedArg(promptArray: string[]) {
	if (promptArray.some(word =>
			Object.values(ARGS_SUPPORTED).some(argArray => argArray.includes(word))
	)) return true
	return false
}

// PROCESSING ARGUMENTS