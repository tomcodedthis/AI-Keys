import * as vscode from "vscode"
import { openSettings } from "../navigation/settings"
import * as fs from "fs"
import * as https from "https"
import * as path from "path"
import { IMAGE_TYPE_DEFAULT } from "./defaults"

export function log(text: unknown, ms = 2000) {
	console.log(text, ms)
	// vscode.window.setStatusBarMessage(text as string, ms)
}

export function notif(message: string, setting = "none", timeout = 10) {
	vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: message + ". ",
			cancellable: true,
		},
		async (progress) => {
			if (setting !== "none") openSettings(setting)

			while (timeout > 0) {
				timeout -= 1
				progress.report({
					increment: 100,
					message: timeout.toString(),
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
	return text.split(' ').join(symbol)
}

export async function download(url: string, prompt: string) {
	log(`Downloading image...`)

	const workspaceFolders = vscode.workspace.workspaceFolders
	if (!workspaceFolders) {
		log("No workspace folder to save to")
		return
	}

	const fileName = join(prompt, "-") + IMAGE_TYPE_DEFAULT
	const folderPath = workspaceFolders[0].uri.fsPath
	const filePath = path.join(folderPath, fileName)

	https.get(url, (res) => {
		const { statusCode } = res
		if (statusCode !== 200) {
			log(`Failed to download image: HTTP status code ${statusCode}`)
			return
		}

		const fileStream = fs.createWriteStream(filePath);
		res.pipe(fileStream);

		fileStream.on('finish', () => {
			log(`Image downloaded at ${filePath}`);
		});
	});
}

export const hasConfig = (prompt: string) => prompt.includes(":")