import * as vscode from "vscode"
import { notif } from "../../utils/utils"
import { openSettings } from "../../navigation/settings"
import { COMMENT_SYMBOLS } from "../../utils/defaults"

export const textEditor = ( message = "I need an open text editor to read and write") => {
	const editor = vscode.window.activeTextEditor
	if (!editor) {
		notif(message, "none")
		return false
	}

	return true
}

export const keyExists = (key: string) => {
	return !key || key.length === 0 ? false : true
}

export function processError(code: number) {
	const badKey = [401, 404]
	if (
		badKey.some((key) => {
			key === code
		})
	) {
		openSettings("aikeys.lines")
		return
	}

	const limit = [429]
	if (
		limit.some((key) => {
			key === code
		})
	)
		return

	const servers = [500]
	if (
		servers.some((key) => {
			key === code
		})
	)
		return
}

export function processArg(prompt: string, arg: string, message: string) {
	return message + prompt.replace(arg, "")
}

export function uncomment(prompt: string) {
	for (const sym of COMMENT_SYMBOLS) {
		if (prompt.includes(sym)) {
			prompt = prompt.replace(sym, "")
		}
	}
	return prompt
}