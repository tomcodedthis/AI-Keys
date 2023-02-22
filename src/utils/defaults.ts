import * as vscode from "vscode"

export const MODEL_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("model") as string
export const PREFIX_DEFAULT = vscode.workspace
	.getConfiguration("AI-Keys")
	.get("prefix") as string

// to-do: add these as vscode.workspace configuration
export const TEMP_DEFAULT = 0.4
export const MAX_TOKENS_DEFAULT = 20
export const TOP_P_DEFAULT = 1
export const FREQ_PEN_DEFAULT = 0
export const PRES_PEN_DEFAULT = 0
export const IMAGE_SIZE_DEFAULT = "256x256"
export const IMAGE_COUNT_DEFAULT = 1
export const IMAGE_TYPE_DEFAULT = "jpg"
export const COMMENT_SYMBOLS = {
	'javascript': '//',
	'typescript': '//',
	'java':  '//',
	'csharp':  '//',
	'python': '#',
    'ruby': '#',
    'php': '#'
}
export const ARGS_SUPPORTED = [
	"op",
	"optimise",
	"optimize",
	"cv",
	"convert",
]
export const MODELS_SUPPORTED = ["gbt", "gbt3", "codex", "dalle"]
export const OPENAI_MODELS = ["gbt", "gbt3", "codex", "dalle"]