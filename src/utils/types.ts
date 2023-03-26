import * as vscode from "vscode"

export interface GeneralRequest {
	language: string
	line: number
	prompt: vscode.TextLine
}

export interface PromptConfig {
	text: string
	nextLine: number
}

export interface clarifaiRequest {
	key: string
	userID: string
	modelID: string
	appID: string
}

export interface hfRequest {
	model: string
	inputs: string
}
