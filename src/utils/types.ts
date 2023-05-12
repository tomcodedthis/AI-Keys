import * as vscode from "vscode"
import { ChatCompletionRequestMessage, ChatCompletionResponseMessage, CreateChatCompletionRequest } from "openai"

export interface GeneralRequest {
	language: string
	line: number
	prompt: vscode.TextLine
}

export interface PromptConfig {
	text: string
	nextLine?: number
	model?: string
	provider?: string
}

export interface ClarifaiRequest {
	key: string
	userID: string
	modelID: string
	appID: string
}

export interface HFRequest {
	model: string
	inputs: string
}

export interface Model {
	name: string
	label: string
}

export interface Provider {
	name: string
	label: string
	models: Model[] | ""
}

export interface Message {
	command: string
	data: {
		model: string
		provider?: string
		system?: string
		prompt: string
	}
}

export type MessageHistory = [
	ChatCompletionRequestMessage
	| ChatCompletionResponseMessage
	| MessageLog
]

export type MessageLog = ChatCompletionRequestMessage
| ChatCompletionResponseMessage
| {
	role: string,
	content: string,
}

export interface ChatMessage {
	message: CreateChatCompletionRequest | ChatCompletionResponseMessage | string
	model?: string
}