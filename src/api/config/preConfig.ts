import {
	MODEL_DEFAULT,
} from "../../utils/defaults"
import { openaiRequest } from "../models/openaiReq"
import { uncomment } from "../check/process"
import { addArg, addModel, supported } from "./promptConfig"

export async function withConfig(prompt: string) {
	prompt = uncomment(prompt)

	const promptArray = prompt.trim().split(":")
	const config = promptArray[0].toLowerCase().trim().split(" ")
	let model = addModel(MODEL_DEFAULT)
	let isValid = false
	prompt = promptArray[1]

	// uses the last occurance of model or arg to parse
	// to-do: multiple args
	for (const arg of config) {
		if (supported("model", arg)) {
			model = addModel(arg)
			isValid = true
		}

		if (supported("arg", arg)) {
			prompt = addArg(arg, prompt)
			isValid = true
		}
	}

	if (isValid) { openaiRequest(model, prompt.trim()) }

}

export function withoutConfig(prompt: string) {
	const model = addModel(MODEL_DEFAULT)
	prompt = uncomment(prompt)

	if (supported("model", model)) openaiRequest(model, prompt.trim())
}