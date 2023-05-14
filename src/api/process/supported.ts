import { ARGS_SUPPORTED, MODELS_DEFAULT } from "../../utils/configuration"
import { getModels } from "../providers/models"

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