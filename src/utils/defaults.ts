import * as vscode from "vscode"

export const MODEL_DEFAULT = vscode.workspace.getConfiguration("AI-Keys").get("model") as string
export const PREFIX_DEFAULT = vscode.workspace.getConfiguration("AI-Keys").get("prefix") as string
export const MAX_TOKENS_DEFAULT = vscode.workspace.getConfiguration("AI-Keys").get("maxTokens") as number
export const IMAGE_FORMAT_DEFAULT = vscode.workspace.getConfiguration("AI-Keys").get("imageFormat") as string

// to-do: add these as vscode.workspace configuration
export const TEMP_DEFAULT = 0
export const TOP_P_DEFAULT = 1
export const FREQ_PEN_DEFAULT = 0
export const PRES_PEN_DEFAULT = 0
export const IMAGE_COUNT_DEFAULT = 1
export const IMAGE_SIZE_DEFAULT = "256x256"
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
export const MODELS_DEFAULT: {[key: string]: string} = {
	"gbt": "text-davinci-003",
	"gbt3": "text-davinci-003",
	"codex": "code-davinci-002",
	"dalle": "dalle"
}
