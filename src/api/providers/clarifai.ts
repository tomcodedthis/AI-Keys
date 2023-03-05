// import * as vscode from "vscode"
// import * as service from "clarifai-nodejs-grpc/proto/clarifai/api/service_pb"
// import * as resources from "clarifai-nodejs-grpc/proto/clarifai/api/resources_pb"
// import { getComment, getLocalImage } from "../process/get"
// import { grpc } from "clarifai-nodejs-grpc"
// import { StatusCode } from "clarifai-nodejs-grpc/proto/clarifai/api/status/status_code_pb"
// import { V2Client } from "clarifai-nodejs-grpc/proto/clarifai/api/service_grpc_pb"
// import { titleCase } from "title-case"
// import { validImage, validKey } from "../process/check"
// import { go, log, notif } from "../../utils/utils"
// import { MODEL_TYPE_DEFAULT } from "../../utils/defaults"

// export async function clarifaiRequest(prompt: string) {
// 	const config = vscode.workspace.getConfiguration("AI-Keys")
// 	const key = config.get("keys.clarifai") as string
// 	let image

// 	if (!validKey(key)) return
// 	if (!validImage(prompt)) return

// 	prompt.startsWith("https") ? (image = prompt) : (image = getLocalImage(prompt))

// 	log(`Your final prompt: ${prompt}\nSent to: Clarifai`)

// 	const clarifai = new V2Client("api.clarifai.com", grpc.ChannelCredentials.createSsl())
// 	const metadata = new grpc.Metadata()
// 	metadata.set("authorization", `Key ${key}`)

// 	if (MODEL_TYPE_DEFAULT === "Image Recognition")
// 		await imageRecognitionRequest(prompt, image as string, clarifai, metadata)
// }

// export async function imageRecognitionRequest(
// 	prompt: string,
// 	image: string,
// 	clarifai: V2Client,
// 	metadata: grpc.Metadata
// ) {
// 	const editor = vscode.window.activeTextEditor as vscode.TextEditor
// 	const comment = getComment()

// 	await vscode.window.withProgress(
// 		{
// 			location: vscode.ProgressLocation.Notification,
// 			title: `${titleCase("Clarifai")} is thinking of a response...` as string,
// 			cancellable: false,
// 		},
// 		async () => {
// 			try {
// 				const request = new service.PostModelOutputsRequest()
// 				request.setModelId("aaa03c23b3724a16a56b629203edc62c")

// 				image.startsWith("https")
// 					? request.addInputs(
// 							new resources.Input().setData(
// 								new resources.Data().setImage(new resources.Image().setUrl(image))
// 							)
// 					  )
// 					: request.addInputs(
// 							new resources.Input().setData(
// 								new resources.Data().setImage(new resources.Image().setBase64(image))
// 							)
// 					  )

// 				clarifai.postModelOutputs(request, metadata, (error, response) => {
// 					if (error || !response) {
// 						notif(`Clarifai Error: ${error?.name}`, 20)
// 						log(`AI-Keys: Clarifai Error $${error?.code}`)
// 						return
// 					}

// 					if (response.getStatus()?.getCode() !== StatusCode.SUCCESS) {
// 						const stausCode = response.getStatus()?.getCode()
// 						let message = `Clarifai Error ${stausCode}: ${response.getStatus()?.getDescription()}`

// 						if (stausCode === 10020) message += ", usually due to incorrect prompt/image"
// 						if (stausCode === 11008) go("aikeys.keys")

// 						notif(message, 20)
// 						log(`AI-Keys: Clarifai Error ${response.getStatus()?.getCode()}`)

// 						return
// 					}

// 					const data = response.getOutputsList()[0].getData() as resources.Data
// 					const concepts = data.getConceptsList()
// 					let conceptList: string[] = []

// 					editor
// 						.edit((line) => {
// 							line.insert(editor.selection.end, `\n\n${comment} Clarifai thinks ${prompt} is:`)
// 						})
// 						.then(() => {
// 							notif(`Here's what Clarifai thinks` as string, 5)
// 							log("AI-Keys: Response Success")

// 							for (const concept of concepts) {
// 								if (conceptList.length >= 10) break

// 								const name = titleCase(concept.getName())
// 								const value = (concept.getValue() * 100).toFixed(2)

// 								conceptList.push(`\n${comment} ${name} (${value}%)`)
// 							}

// 							editor.edit((line) => {
// 								line.insert(editor.selection.end, conceptList.join(""))
// 							})
// 						})
// 				})
// 			} catch (error: any) {
// 				notif(`Clarifai Error: ${error.response.data.error}`, 20)
// 				log(`AI-Keys: Clarifai Error ${error.response.data.error.status}`)
// 			}
// 		}
// 	)
// }
