import * as vscode from "vscode"
import { ChatCompletionResponseMessage, CreateChatCompletionRequest } from "openai"

export interface GeneralRequest {
	language: string
	line: number
	prompt: vscode.TextLine
}

export interface PromptConfig {
	text: string
	nextLine?: number
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

export interface model {
	name: string
	label: string
}

export interface provider {
	name: string
	label: string
	models: model[] | ""
}

export interface message {
	command: string
	data: {
		model: string
		provider?: string
		system?: string
		prompt: string
	}
}

export interface chatMessage {
	message: CreateChatCompletionRequest | ChatCompletionResponseMessage
	model?: string
}
