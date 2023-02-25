import * as vscode from "vscode"

export interface GeneralRequest {
	language: string
	line: number
	prompt: vscode.TextLine
}

export interface OpenAIRequest {
	model: string
	prompt: string
	temperature: number
	max_tokens: number
	top_p: number
	frequency_penalty: number
	presence_penalty: number
	stream: boolean
}

export interface PromptConfig {
	text: string
	nextLine: number
}
