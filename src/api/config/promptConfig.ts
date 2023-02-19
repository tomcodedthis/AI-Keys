import {
	MODEL_DEFAULT,
	OPENAI_MODELS,
	MODELS_SUPPORTED,
} from "../../utils/defaults"
import { openaiRequest } from "../models/openaiReq"
import { notif, log } from "../../utils/utils"
import { currentComment } from "../get/get"
import { uncomment } from "../check/process"

export async function searchWithConfig(prompt: string) {
	const comment = currentComment(prompt)
	prompt = uncomment(prompt)

	const wordArray = prompt.trim().split(":")
	const model = wordArray[0].toLowerCase()
	log(model)
	if (!MODELS_SUPPORTED.includes(model)) {
		notif(
			"I don't recognise that model, check prompt or see our list of supported models",
			"aikeys.model"
		)
		return
	}

	if (OPENAI_MODELS.includes(model)) {
		log("Starting OpenAI request..")
		openaiRequest(model, wordArray[1], comment)
	}
}

export function searchWithoutConfig(prompt: string) {
	const comment = currentComment(prompt)
	prompt = uncomment(prompt)

	openaiRequest(MODEL_DEFAULT, prompt.trim(), comment)
}
