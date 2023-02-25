import { ARGS_SUPPORTED, MODELS_SUPPORTED, OPENAI_MODELS, COMMENT_SYMBOLS, CONVERT_DEFAULT } from "../../utils/defaults"
import { log, notif } from "../../utils/utils"
import { getLanguage } from "../process/get"

export function addModel(model: string) {
	if (model.toLowerCase() === "codex") return "code-davinci-002"
	if (model.toLowerCase() === "dalle") return "dalle"

	return "text-davinci-003"
}

export function addArg(arg: string, prompt: string) {
	const language = getLanguage() as string

	if (!Object.values(ARGS_SUPPORTED).some((val) => { return val.some((phrase) => { return arg === phrase })}) ) {
		notif("Invalid argument, using default settings.\nCheck AI-Keys list of suported arguments.")
		log("AI-Keys: Invalid prompt argument")
		
		return prompt
	}

	if (ARGS_SUPPORTED.op.some(phrase => { return arg === phrase })) {
		prompt = prompt.replace(arg, "").trim()
		prompt = `refactor and optimize this ${language} code \n${prompt}`
	}

	if (ARGS_SUPPORTED.cv.some(phrase => { return arg === phrase })) {
		let convertTo = CONVERT_DEFAULT;
		Object.keys(COMMENT_SYMBOLS).some(lang => {
			if (prompt.includes(lang)) {
				convertTo = lang
				prompt = prompt.replace(lang, "").trim()
				return true
			}
		})

		prompt = prompt.replace(arg, "").trim()
		prompt = `convert this from ${language} to ${convertTo} \n${prompt}`
	}

	if (ARGS_SUPPORTED.ex.some(phrase => { return arg === phrase })) {
		prompt = prompt.replace(arg, "").trim()
		prompt = `explain this ${language} code \n${prompt}`
	}

	return prompt.trim()
}

export function supported(type: string, arg: string) {
	if (type === "model") {
		if (!MODELS_SUPPORTED.includes(arg.toLowerCase())) return false
		if (!OPENAI_MODELS.includes(arg)) return false
	}

	if (type === "arg") {
		if (!Object.values(ARGS_SUPPORTED).some((args) => args.some((phrase) => arg === phrase))) return false
	}

	return true
}
