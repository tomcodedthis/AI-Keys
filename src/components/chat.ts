import * as vscode from "vscode"
import { chatHTMl } from "./chatHTML"
import { config } from "../api/config"
import { PromptConfig, message } from "../utils/types"
import { clearChat } from "../api/providers/openai"
import { log } from "../utils/utils"
import { ChatCompletionRequestMessage } from "openai"

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
					const prompt = {
						text: `${message.data.model} ${message.data.prompt}`,
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
				case "viewSettings": {
					this.hideSettings()
					break
				}
			}
		})

		if (this.view?.visible) this.view.webview.postMessage({ 
			command: "loadChat",
			data: vscode.workspace.getConfiguration("AI-Keys").get("openAI.messages") as ChatCompletionRequestMessage[]
		})

		this.view?.onDidChangeVisibility(e => {
			if (this.view?.visible) this.view.webview.postMessage({
				command: "loadChat",
				data: vscode.workspace.getConfiguration("AI-Keys").get("openAI.messages") as ChatCompletionRequestMessage[]
			})
		})

		webviewView.webview.onDidReceiveMessage
	}

	private getHtmlForWebview(webview: vscode.Webview) {
		return chatHTMl(webview, this.extensionUri)
	}

	public hideSettings() {
		this.view?.webview.postMessage({
			command: "viewSettings",
			data: !this.viewSettings,
		})

		this.viewSettings = !this.viewSettings
	}
}
