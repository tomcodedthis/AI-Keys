import * as vscode from "vscode"

export const MODEL_DEFAULT = vscode.workspace.getConfiguration("AI-Keys").get("defaultModel") as string
export const PREFIX_DEFAULT = vscode.workspace.getConfiguration("AI-Keys").get("prefix") as string
export const IMAGE_FORMAT_DEFAULT = vscode.workspace.getConfiguration("AI-Keys").get("imageFormat") as string
export const IMAGE_SIZE_DEFAULT = vscode.workspace.getConfiguration("AI-Keys").get("imageResolution") as string

// Open AI
export const MAX_TOKENS_DEFAULT = vscode.workspace.getConfiguration("AI-Keys.openAI").get("maxTokens") as number

// Clarifai
export const MODEL_TYPE_DEFAULT = vscode.workspace.getConfiguration("AI-Keys").get("clarifai.modelType") as string

// to-do: add these as vscode.workspace configuration
export const TEMP_DEFAULT = 0
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
}
export const CONVERT_DEFAULT = "javascript"
export const MODELS_DEFAULT: { [key: string]: string } = {
	gbt: "text-davinci-003",
	gbt3: "text-davinci-003",
	codex: "code-davinci-002",
	dalle: "dalle",
	// clarifai: "clarifai",
	// clar: "clarifai",
}
