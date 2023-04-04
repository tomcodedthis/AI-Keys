import * as vscode from "vscode"
import { chatHTMl } from "./chatHTML"
import { config } from "../api/config"
import { PromptConfig, message } from "../utils/types"
import { clearChat } from "../api/providers/openai"

export class ChatWindow implements vscode.WebviewViewProvider {
	public static readonly viewType = "aikeys.chat"
	public view?: vscode.WebviewView

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
			}
		})
	}

	private getHtmlForWebview(webview: vscode.Webview) {
		return chatHTMl(webview, this.extensionUri)
	}
}
