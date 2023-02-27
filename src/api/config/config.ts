import { ARGS_SUPPORTED, MODELS_DEFAULT, MODEL_DEFAULT } from "../../utils/defaults"
import { PromptConfig } from "../../utils/types"
import { log } from "../../utils/utils"
import { getArg, getModel } from "../process/get"
import { getModels } from "../sources/models"
import { openaiRequest } from "../sources/openai"

export async function config(prompt: PromptConfig) {
	const promptArray = prompt.text.trim().split(" ").slice(0, 5)
	const models = await getModels() as string[]
	let model = MODELS_DEFAULT[MODEL_DEFAULT.toLowerCase()]

	// from first 4 words, use the last occurance of a model or arg
	// to-do: multiple args
	if (supportedModel(promptArray, models)) {
		model = getModel(promptArray, models)
		prompt.text = prompt.text
			.split(" ")
			.filter(word => {
				return !promptArray.some(arg => word !== arg)
					|| !Object.keys(MODELS_DEFAULT).includes(word) })
			.join(" ")
			.trim()
	}

	if (supportedArg(promptArray)) {
		prompt.text = getArg(promptArray, prompt.text)
	}

	await openaiRequest(model, prompt)
}

export function supportedModel(promptArray: string[], fullList: string[]) {
	if (promptArray.some(word =>
			fullList.includes(word)
			|| Object.keys(MODELS_DEFAULT).includes(word)
	)) return true
	return false
}

export function supportedArg(promptArray: string[]) {
	if (promptArray.some(word =>
			Object.values(ARGS_SUPPORTED).some(argArray => argArray.includes(word))
	)) return true
	return false
}

// PROCESSING ARGUMENTS