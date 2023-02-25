import { MODEL_DEFAULT } from "../../utils/defaults"
import { PromptConfig } from "../../utils/types"
import { openaiRequest } from "../sources/openai"
import { addArg, addModel, supported } from "./configHelpers"

export async function config(prompt: PromptConfig) {
	const promptArray = prompt.text.trim().split(" ")
	let model = addModel(MODEL_DEFAULT)

	// uses the last occurance of model or arg to parse
	// to-do: multiple args
	promptArray.some((word) => {
		if (supported("model", word)) {
			prompt.text = prompt.text.replace(word, "").trim()
			model = addModel(word).trim()
		}

		if (supported("arg", word)) {
			prompt.text = prompt.text.replace(word, "")
			prompt.text = addArg(word, prompt.text).trim()
		}
	})

	openaiRequest(model, prompt)
}
