import { ARGS_SUPPORTED, MODELS_SUPPORTED, OPENAI_MODELS } from "../../utils/defaults"
import { log, notif } from "../../utils/utils"
import { getLanguage } from "../get/get"

export function addModel(model: string) {
	return model.toLowerCase() === "codex"
		? "code-davinci-002"
		: "text-davinci-003"
}

export function addArg(arg: string, prompt: string) {
	const language = getLanguage() as string

	if (!Object.values(ARGS_SUPPORTED).some(val => { 
		return val.some(phrase => {
			return arg === phrase})
		})) {
		notif("Invalid argument, using default settings. Check our list of suported arguments.")
		return prompt
	}

	if (ARGS_SUPPORTED.op.some((phrase) => { return arg === phrase })) {
		prompt = processArg(prompt, "op", `optimise this ${language} code\n`)
	}
	
	if (ARGS_SUPPORTED.cv.some((phrase) => { return arg === phrase })) {
		prompt = processArg(prompt, "cv", `convert this ${language} code to javascript `)
	}

	if (ARGS_SUPPORTED.ex.some((phrase) => { return arg === phrase })) {
		prompt = processArg(prompt, "ex", `explain this ${language} code `)
	}

	return prompt.trim()
}

export function processArg(prompt: string, arg: string, message: string) {
	return message + prompt.replace(arg, "")
}

export function supported(type: string, arg: string) {
	if (type === "model") {
		if (!MODELS_SUPPORTED.includes(arg.toLowerCase())) return false
		if (!OPENAI_MODELS.includes(arg)) return false
	}

	if (type === "arg") {
		if (!Object.values(ARGS_SUPPORTED).some((args) => args.some(
			(phrase) => arg === phrase))) return false
	}

	return true
}
