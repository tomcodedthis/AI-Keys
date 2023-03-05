import { ARGS_SUPPORTED, MODELS_DEFAULT, MODEL_DEFAULT } from "../../utils/defaults"
import { PromptConfig } from "../../utils/types"
import { getArg, getModel } from "../process/get"
import { processArg, removeArg } from "../process/process"
import { clarifaiRequest } from "../providers/clarifai"
import { getModels } from "../providers/models"
import { openaiRequest } from "../providers/openai"

export async function config(prompt: PromptConfig) {
	const argArray = prompt.text.trim().split(" ").slice(0, 5)
	const models = (await getModels()) as string[]
	let model = MODELS_DEFAULT[MODEL_DEFAULT.toLowerCase()]

	// from first 4 words, use the last occurance of a model or arg
	// to-do: multiple args
	if (await supportedModel(argArray, "default")) {
		model = getModel(argArray)
		prompt.text = removeArg(Object.keys(MODELS_DEFAULT), prompt.text)
	} else if (await supportedModel(argArray, "openai")) {
		model = getModel(argArray, models)
		prompt.text = removeArg(models, prompt.text)
	}

	if (model === "clarifai") {
		if (supportedArg(argArray)) {
			let args: string[] = []
			Object.values(ARGS_SUPPORTED).forEach((array) => (args = args.concat(array)))

			prompt.text = removeArg(args, prompt.text)
		}

		await clarifaiRequest(prompt.text)
		return
	}

	if (supportedArg(argArray)) {
		const arg = getArg(argArray)
		prompt.text = processArg(arg, prompt.text)
	}

	await openaiRequest(model, prompt)
}

export async function supportedModel(promptArray: string[], check: string) {
	if (check === "default") {
		return promptArray.some((word) => Object.keys(MODELS_DEFAULT).includes(word))
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
