import * as vscode from "vscode"
import * as request from "request"
import { titleCase } from "title-case"
import { getComment, getLocalImage } from "../process/get"
import { validImage, validKey } from "../process/check"
import { go, log, notif } from "../../utils/utils"
import { MODEL_ID_DEFAULT, MODEL_TYPE_DEFAULT } from "../../utils/configuration"
import { clarifaiRequest } from "../../utils/types"

export async function clarifaiRequest(prompt: string) {
	const config = vscode.workspace.getConfiguration("AI-Keys")
	const key = config.get("keys.clarifai") as string
	const clarifai = {
		key: key,
		userID: "",
		modelID: MODEL_ID_DEFAULT,
		appID: "",
	}
	let image

	if (!validKey(key)) return
	if (!validImage(prompt)) return

	prompt.startsWith("https") ? (image = prompt) : (image = getLocalImage(prompt))

	log(`Your final prompt: ${prompt}\nSent to: Clarifai`)

	if (MODEL_TYPE_DEFAULT === "Image Recognition")
		await imageRecognitionRequest(prompt, image as string, clarifai)
}

export async function imageRecognitionRequest(
	prompt: string,
	image: string,
	clarifai: clarifaiRequest
) {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor
	const comment = getComment()

	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `${titleCase("Clarifai")} is thinking of a response...` as string,
			cancellable: false,
		},
		async () => {
			try {
				const baseURL = "https://api.clarifai.com"
				const url = `${baseURL}/v2/models/${clarifai.modelID}/outputs`
				const data = {
					inputs: [
						{
							data: {
								image: image.startsWith("https") ? { url: image } : { base64: image },
							},
						},
					],
				}
				const options = {
					url: url,
					json: true,
					headers: {
						Authorization: `Key ${clarifai.key}`,
						"Content-Type": "application/json",
					},
					body: data,
				}

				request.post(options, async (error, res) => {
					if (error || !res) {
						notif(`Clarifai Error: ${error.name}`, 20)
						log(`AI-Keys: Clarifai Error $${error.code}`)
						return
					}

					if (res.body.status.code !== 10000) {
						const stausCode = res.body.status.code
						let message = `Clarifai Error ${stausCode}: ${res.body.status.description}`

						if (stausCode === 10020) message += ", usually due to incorrect prompt/image"
						if (stausCode === 11008) go("aikeys.keys")

						notif(message, 20)
						log(`AI-Keys: Clarifai Error ${stausCode}`)

						return
					}

					const concepts = res.body.outputs[0].data.concepts
					const conceptList: string[] = []

					editor
						.edit((line) => {
							line.insert(editor.selection.end, `\n\n${comment} Clarifai thinks ${prompt} is:`)
						})
						.then(() => {
							notif(`Here's what Clarifai thinks` as string, 5)
							log("AI-Keys: Response Success")

							for (const concept of concepts) {
								if (conceptList.length >= 10) break

								const name = titleCase(concept.name)
								const value = (concept.value * 100).toFixed(2)

								conceptList.push(`\n${comment} ${name} (${value}%)`)
							}

							editor.edit((line) => {
								line.insert(editor.selection.end, conceptList.join(""))
							})
						})
				})
			} catch (error: any) {
				notif(`Clarifai Error: ${error.response.data.error}`, 20)
				log(`AI-Keys: Clarifai Error ${error.response.data.error.status}`)
			}
		}
	)
}
