import { ChatCompletionRequestMessage } from "openai"
import * as vscode from "vscode"
import { Provider } from "./types"

//  Shared
export const MODEL_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("defaultModel") as string
export const ACTIVE_PROVIDER = vscode.workspace
	.getConfiguration("AI-Keys.active")
	.get("provider") as string
export const ACTIVE_MODEL = vscode.workspace
	.getConfiguration("AI-Keys.active")
	.get("model") as string
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
export const CLARIFAI_MODEL_TYPE = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("clarifai.modelType") as string
export const CLARIFAI_MODEL_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("clarifai.modelID") as string

// Hugging Face
export const HF_MODEL_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("huggingFace.model") as string
export const HF_MODEL_TYPE_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("huggingFace.modelType") as string

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
	model: ["model", "mod"],
}
export const CONVERT_DEFAULT = "javascript"
export const PROVIDERS_DEFAULT: Provider[] = [
	{
		name: "openai",
		label: "Open AI",
		models: [
			{
				name: "gpt-3.5-turbo",
				label: "GPT-3.5-Turbo",
			},
			{
				name: "text-davinci-003",
				label: "GPT-3",
			},
			{
				name: "dalle",
				label: "DALL·E",
			},
		],
	},
	{
		name: "huggingface",
		label: "Hugging Face",
		models: "",
	},
	{
		name: "clarifai",
		label: "Clarifai",
		models: "",
	},
]
export const MODELS_DEFAULT: { [key: string]: string } = {
	"gpt-3.5-turbo": "gpt-3.5-turbo",
	gpt: "gpt-3.5-turbo",
	gpt3: "text-davinci-003",
	dalle: "dalle",
	clarifai: "clarifai",
	clar: "clarifai",
	huggingface: "huggingFace",
	hface: "huggingFace",
	hf: "huggingFace",
}
export const GPT_TURBO_MODELS = ["gpt-3.5-turbo", "gpt-3.5-turbo-0301"]
export const HF_ARGS = ["text", "sum", "stt"]
