import {
	MODEL_DEFAULT,
	OPENAI_MODELS,
	MODELS_SUPPORTED,
} from "../../utils/defaults"
import { openaiRequest } from "../models/openaiReq"
import { notif, log } from "../../utils/utils"
import { uncomment } from "../check/process"

export async function searchWithConfig(prompt: string) {
	prompt = uncomment(prompt)

	const wordArray = prompt.trim().split(":")
	const model = wordArray[0].toLowerCase().trim()

	if (supported(model)) openaiRequest(model, wordArray[1])
}

export function searchWithoutConfig(prompt: string) {
	const model = MODEL_DEFAULT.toLowerCase()
	prompt = uncomment(prompt)

	if (supported(model)) openaiRequest(model, prompt.trim())
}

export function supported(model: string) {
	if (!MODELS_SUPPORTED.includes(model.toLowerCase())) {
		notif(
			"I don't recognise that model, check prompt or see our list of supported models",
			"aikeys.model"
		)
		return false
	}

	if (OPENAI_MODELS.includes(model)) {
		log("Starting OpenAI request..")
		return true
	}

	return false
}
