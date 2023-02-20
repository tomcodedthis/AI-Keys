import * as vscode from "vscode"
import { openSettings } from "../navigation/settings"

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

export const hasConfig = (prompt: string) => prompt.includes(":")