import * as vscode from "vscode"
import * as fs from "fs"
import * as https from "https"
import * as path from "path"
import { IMAGE_FORMAT_DEFAULT, LINE_LENGTH_DEFAULT } from "./configuration"
import { getComment } from "../api/process/get"
import { titleCase } from "title-case"
import { Message, MessageHistory } from "./types"

export function go(setting: string, user = true) {
	vscode.commands
		.executeCommand("workbench.action.openSettings", `${setting === "none" ? "aikeys" : setting}`)
		.then(() => {
			if (!user) vscode.commands.executeCommand("workbench.action.openWorkspaceSettings")
		})
}

export function log(text: unknown) {
	const time = new Date().toLocaleTimeString("en-uk")
	const message = `${time} - ${text}`

	console.log(message)
	vscode.window.setStatusBarMessage(message)
}

export function notif(message: string, timeout = 10, setting = "none", user = false) {
	vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: message,
			cancellable: true,
		},
		async (progress) => {
			if (setting !== "none") user ? go(setting, user) : go(setting)

			while (timeout > 0) {
				timeout -= 1
				progress.report({
					increment: 100,
					message: `${timeout.toString()}`,
				})

				await sleep(1000)
			}
		}
	)
}

export const sleep = (ms: number): Promise<unknown> => {
	return new Promise((resolve) => {
		return setTimeout(resolve, ms)
	})
}

export function join(text: string, symbol: string) {
	return text.split(" ").join(symbol)
}

export async function download(url: string, prompt: string, webview? : vscode.WebviewView) {
	const workspaceFolders = vscode.workspace.workspaceFolders
	if (!workspaceFolders) {
		notif("No workspace folder to save to")
		log("AI-Keys: No workspace folder found")
		return
	}

	const comment = getComment()
	const fileName = `${join(prompt, "_")}.${IMAGE_FORMAT_DEFAULT}`
	const folderPath = workspaceFolders[0].uri.fsPath
	const filePath = path.join(folderPath, fileName)

	https.get(url, (res) => {
		const { statusCode } = res
		if (statusCode !== 200) {
			log(`Failed to download image: HTTP status code ${statusCode}`)
			return
		}

		const fileStream = fs.createWriteStream(filePath)
		res.pipe(fileStream)

		fileStream.on("finish", () => {
			let message = ""

			if (webview) {
				message += `<p>Image URL here: <a href="${url}">${prompt}</a></p><br><br>`
			}

			message += webview
				? `Image downloaded here: ${filePath}`
				: `\n${comment}\n${comment} Image downloaded here:\n${comment} ${filePath}\n`
			
			write(message, "assistant", webview)
			updateChat([{
				role: "assistant",
				content: message
			}], true)

			log("AI-Keys: Image download success")
		})
	})
}

export function write(
	res: string,
	aiName: string,
	webview?: vscode.WebviewView,
	nextLine?: number
) {
	notif(`Here's what ${titleCase(aiName)} thinks` as string, 5)
	log("AI-Keys: Response Success")

	const editor = vscode.window.activeTextEditor as vscode.TextEditor
	const comment = getComment()
	let lineLength = 0

	const text = res
		.split("")
		.slice(aiName === "text-davinci-003" ? 2 : 0)
		.map((letter) => {
			lineLength += letter.length

			if (lineLength > LINE_LENGTH_DEFAULT && letter === " ") {
				letter = `\n${comment} `
				lineLength = 0
			}

			return letter === `\n` ? `${letter}${comment} ` : letter
		})

	if (webview) {
		// Do chat things
		const message: Message = {
			command: "sendResponse",
			data: {
				model: aiName,
				prompt: res,
			},
		}
		webview.webview.postMessage(message)
	} else {
		editor.edit((editBulder) => {
			editBulder.insert(new vscode.Position(nextLine || 0, 0), `\n${comment} ${text.join("")}\n`)
		})
	}
}

export function updateChat(
	entry: MessageHistory,
	openai?: boolean
) {
	const config = vscode.workspace.getConfiguration("AI-Keys")
	const prevMsgs = config.get("messages") as MessageHistory
	const newMsgs = prevMsgs ? prevMsgs.concat(entry) : entry

	config.update("messages", newMsgs)

	if (openai) config.update("openAI.messages", newMsgs)
}

export function clearChat() {
	const config = vscode.workspace.getConfiguration("AI-Keys")
	config.update("messages", [])
	config.update("openAI.messages", [])

	notif(`AI-Keys: Chat history cleared`, 5)
}
