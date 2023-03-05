import * as vscode from "vscode"
import * as fs from "fs"
import { log, notif } from "../../utils/utils"
import { getComment } from "./get"

export const activeEditor = (message = "I need an open text editor to read and write") => {
	const editor = vscode.window.activeTextEditor
	if (!editor) {
		notif(message)
		log("AI-Keys: No open text editor")

		return false
	}

	return true
}

export const validInput = (prompt: string | undefined) => {
	if (!prompt || prompt.trim().length === 0) {
		notif("You didn't enter a prompt")
		log("AI-Keys: No prompt")

		return false
	}

	if (prompt.trim().length === 1) {
		notif("Prompt must be  longer than 1 character")
		log("AI-Keys: Prompt too short")

		return false
	}

	return true
}

export const validKey = (key: string) => {
	if (!key || key.length === 0) {
		notif("I need a key to start...", 10, "aikeys.keys", true)
		log("AI-Keys: No API key")

		return false
	}

	return true
}

export const validImage = (prompt: string) => {
	if (prompt.startsWith("https")) return true
	if (fs.existsSync(prompt)) return true

	notif(
		"AI-Keys: Unable to process image, check your prompt. URL's require using HTTPS. Local images require absolute paths",
		20
	)
	return false
}

export const isComment = (text: string) => {
	const comment = getComment()

	return text.split(" ")[0] === comment ? true : false
}
