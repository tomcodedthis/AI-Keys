import { titleCase } from "title-case"
import * as vscode from "vscode"
import { log, notif } from "../../utils/utils"

export async function setModel(provider: string, newModel: string, title?: string) {
	try {
		await vscode.workspace
			.getConfiguration("AI-Keys")
			.update(`${provider}.model`, newModel)
			.then(() => {
				vscode.commands.executeCommand("workbench.action.reloadWindow")
				notif(`AI-Keys: ${title ? title : titleCase(provider)} model set to ${newModel}`)
				log(`AI-Keys: ${title ? title : titleCase(provider)} model set to ${newModel}`)
			})
	} catch (error) {
		notif(`AI-Keys Error: Unable to change model. ${error}`, 20)
		log(`AI-Keys: ${error}`)
	}
}
