import * as vscode from "vscode"
import { chatHTMl } from "./chatHTML"
import { config } from "../api/config"
import { PromptConfig, message } from "../utils/types"
import { clearChat } from "../api/providers/openai"
import { log } from "../utils/utils"
import { ChatCompletionRequestMessage } from "openai"
import { ACTIVE_PROVIDER, CHAT_LOG } from "../utils/configuration"

export class ChatWindow implements vscode.WebviewViewProvider {
	public static readonly viewType = "aikeys.chat"
	public view?: vscode.WebviewView
	private viewSettings = true

	constructor(private readonly extensionUri: vscode.Uri) {}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		_context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		this.view = webviewView

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this.extensionUri],
		}

		webviewView.webview.html = this.getHtmlForWebview(webviewView.webview)

		// Recieve message from javascript
		webviewView.webview.onDidReceiveMessage(async (message: message) => {
			switch (message.command) {
				case "sendPrompt": {
					const system = message.data.system
					const prompt = {
						text: `${message.data.provider} ${message.data.prompt}`,
					}

					if (system) {
						await vscode.workspace.getConfiguration("AI-Keys.openAI").update("system", system)

						const messages = vscode.workspace
							.getConfiguration("AI-Keys.openAI")
							.get("messages") as ChatCompletionRequestMessage[]

						if (messages.length > 0) messages[0].content = system

						await vscode.workspace.getConfiguration("AI-Keys.openAI").update(`messages`, messages)
					}

					await config(prompt, webviewView)
					break
				}
				case "clearChat": {
					clearChat()
					break
				}
				case "goToSettings": {
					vscode.commands.executeCommand("aikeys.goToSettings")
					break
				}
				case "changeProvider": {
					const provider = message.data.provider
					vscode.workspace.getConfiguration("AI-Keys.active").update("provider", provider)

					this.changeProvider(provider as string)
					break
				}
				case "changeModel": {
					let provider = message.data.provider
					if (provider === "openai") provider = "openAI"
					if (provider === "huggingface") provider = "huggingFace"

					await vscode.workspace
						.getConfiguration(`AI-Keys.${provider}`)
						.update("model", message.data.model)
					break
				}
				case "changeSystem": {
					await vscode.workspace
						.getConfiguration(`AI-Keys.openAI`)
						.update("system", message.data.system)
					break
				}
			}
		})

		if (this.view?.visible) {
			this.loadChat()
			this.changeProvider(
				vscode.workspace.getConfiguration("AI-Keys.active").get("provider") as string
			)
		}

		this.view?.onDidChangeVisibility(() => {
			this.loadChat()
			this.changeProvider(
				vscode.workspace.getConfiguration("AI-Keys.active").get("provider") as string
			)
		})
	}

	private getHtmlForWebview(webview: vscode.Webview) {
		return chatHTMl(webview, this.extensionUri)
	}

	public loadChat() {
		this.view?.webview.postMessage({
			command: "loadChat",
			data: {
				system: vscode.workspace.getConfiguration("AI-Keys.openAI").get("system"),
				messages: vscode.workspace
					.getConfiguration("AI-Keys.openAI")
					.get("messages") as ChatCompletionRequestMessage[],
			},
		})
	}

	public changeProvider(provider: string) {
		if (provider === "openai") provider = "openAI"
		if (provider === "huggingface") provider = "huggingFace"

		this.view?.webview.postMessage({
			command: "changeProvider",
			data: {
				provider: provider,
				model: vscode.workspace.getConfiguration(`AI-Keys.${provider}`).get("model"),
				system: vscode.workspace.getConfiguration("AI-Keys.openAI").get("system"),
			},
		})
	}
}
