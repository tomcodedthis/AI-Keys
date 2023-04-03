import * as vscode from "vscode"
import { ACTIVE_PROVIDER, PROVIDERS_DEFAULT } from "../utils/configuration"
import { model } from "../utils/types"

export function chatHTMl(webview: vscode.Webview, extensionUri: vscode.Uri) {
	const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", "main.js"))
	const iconUri = webview.asWebviewUri(
		vscode.Uri.joinPath(extensionUri, "media/images", "aikeys-idle.png")
	)
	const gifUri = webview.asWebviewUri(
		vscode.Uri.joinPath(extensionUri, "media/images", "aikeys-thinking.gif")
	)
	const styleResetUri = webview.asWebviewUri(
		vscode.Uri.joinPath(extensionUri, "media/css", "reset.css")
	)
	const styleVSCodeUri = webview.asWebviewUri(
		vscode.Uri.joinPath(extensionUri, "media/css", "vscode.css")
	)
	const styleMainUri = webview.asWebviewUri(
		vscode.Uri.joinPath(extensionUri, "media/css", "main.css")
	)

	return `
		<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<link href="${styleResetUri}" rel="stylesheet">
					<link href="${styleVSCodeUri}" rel="stylesheet">
					<link href="${styleMainUri}" rel="stylesheet">
					<title>AI Keys</title>
				</head>

				<body>
					<div class="response-panel">
						<div
							id="chat"
							class="chat"
						></div>

						<img
							id="icon"
							src="${iconUri}"
							class="input icon"
						/>
				
						<img
							id="gif"
							src="${gifUri}"
							class="input icon"
							hidden
						/>
					</div>

					<form>
						<label for="system">
							System

							<input
								id="system"
								class="input"
								placeholder="You are a helpful assistant..."
								type="text"
							/>
						</label>

						<div class="model-choice-cont">
							<label for="providers">
								Provider
								<select
									name="providers"
									id="providers"
									class="input"
									selected="${ACTIVE_PROVIDER}"
								>
									${PROVIDERS_DEFAULT.map((provider) => {
										return option(provider.name, provider.label)
									})}
								</select>
							</label>

							<label for="models">
								Model

								${PROVIDERS_DEFAULT.map((provider) => {
									if (ACTIVE_PROVIDER === provider.name) {
										return provider.models === ""
											? textInput(provider.label)
											: options(provider.models)
									}
									return undefined
								}).filter((res) => {
									return res !== undefined
								})}
							</label>
						</div>

						<textarea
							class="input"
							placeholder="What is a good prompt to write as an example?"
							id="prompt-text"
						></textarea>

						<button
							type="button"
							class="input"
							id="prompt-btn"
						>
							Send Prompt
						</button>
					</form>

					<script src="${scriptUri}"></script>
				</body>
			</html>
	`
}

export function option(name: string, label: string) {
	return `
		<option class="input" value="${name}">${label}</option>
	`
}

export function options(optionsArray: model[]) {
	return `
		<select
			name="models"
			id="models"
			class="input"
		>
			${optionsArray.map((model) => {
				return option(model.name, model.label)
			})}
		</select>
	`
}

export function textInput(provider: string) {
	return `
		<input
			placeholder="Enter ${provider} model name/id..."
		/>
	`
}
