import * as vscode from "vscode"

export const MODEL_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("model") as string
export const PREFIX_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("prefix") as string

// to-do: add these to extension vscode.workspace configuration
export const TEMP_DEFAULT = 0.7
export const MAX_TOKENS_DEFAULT = 20
export const TOP_P_DEFAULT = 1
export const FREQ_PEN_DEFAULT = 0
export const PRES_PEN_DEFAULT = 0

export const MODELS_SUPPORTED = ["gbt", "gbt3", "codex", "dalle"]
export const ARGS_SUPPORTED = [
	"op",
	"optimise",
	"optimize",
	"cv",
	"convert",
]
export const OPENAI_MODELS = ["gbt", "gbt3", "codex", "dalle"]
export const COMMENT_SYMBOLS = ["//", "/*", "*/", "#"]