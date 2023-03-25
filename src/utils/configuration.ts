import { ChatCompletionRequestMessage } from "openai"
import * as vscode from "vscode"

//  Shared
export const MODEL_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("defaultModel") as string
export const PREFIX_DEFAULT = vscode.workspace.getConfiguration("AI-Keys").get("prefix") as string
export const IMAGE_FORMAT_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("imageFormat") as string
export const IMAGE_SIZE_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("imageResolution") as string

// Open AI
export const MAX_TOKENS_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys.openAI")
	.get("maxTokens") as number
export const CHAT_SYSTEM_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys.openAI")
	.get("system") as string
export const CHAT_LOG = vscode.workspace
	.getConfiguration("AI-Keys.openAI")
	.get("messages") as ChatCompletionRequestMessage[]
export const TOKEN_WARN_LIMIT = vscode.workspace
	.getConfiguration("AI-Keys.openAI")
	.get("tokenWarn") as number

// Clarifai
export const MODEL_TYPE_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("clarifai.modelType") as string
export const MODEL_ID_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("clarifai.modelID") as string

// to-do: add these as vscode.workspace configuration
export const LINE_LENGTH_DEFAULT = 100
export const TEMP_DEFAULT = 0.6
export const TOP_P_DEFAULT = 1
export const FREQ_PEN_DEFAULT = 0
export const PRES_PEN_DEFAULT = 0
export const IMAGE_COUNT_DEFAULT = 1
export const COMMENT_SYMBOLS = {
	javascript: "//",
	typescript: "//",
	java: "//",
	csharp: "//",
	python: "#",
	ruby: "#",
	php: "#",
}
export const ARGS_SUPPORTED = {
	op: ["op", "optimise", "optimize"],
	cv: ["cv", "convert"],
	ex: ["ex", "explain"],
	chatReset: ["clearChat", "resetChat", "resetGPT"],
}
export const CONVERT_DEFAULT = "javascript"
export const MODELS_DEFAULT: { [key: string]: string } = {
	"gpt-3.5-turbo": "gpt-3.5-turbo",
	gpt: "gpt-3.5-turbo",
	gpt3: "text-davinci-003",
	dalle: "dalle",
	clarifai: "clarifai",
	clar: "clarifai",
}
export const GPT_TURBO_MODELS = ["gpt-3.5-turbo", "gpt-3.5-turbo-0301"]
