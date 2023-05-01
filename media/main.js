;(function () {
	const vscode = acquireVsCodeApi()
	const oldState = vscode.getState() || {
		idle: true,
		viewSettings: true,
		system: "",
		provider: "",
		model: "",
		prompt: "",
		messages: [],
	}

	const chat = document.getElementById("chat")
	const btn = document.getElementById("prompt-btn")
	const prompt = document.getElementById("prompt-text")
	const system = document.getElementById("system")
	const providers = document.getElementById("providers")
	const models = document.getElementById("models")
	const clearChatBtn = document.getElementById("clear-chat-btn")
	const settingsBtn = document.getElementById("settings-btn")
	const settingsCont = document.getElementById("settings-cont")
	const viewSettingsBtn = document.getElementById("view-settings-btn")
	const hideSettings = document.getElementsByClassName("hide-settings")
	const copyCont = document.getElementsByClassName("copied-cont")

	let keysDown = []
	let shortcut = false

	btn?.addEventListener("click", () => {
		sendPrompt()
	})
	prompt?.addEventListener("input", () => {
		vscode.setState({ ...oldState, prompt: prompt?.value })
	})
	system?.addEventListener("input", () => {
		vscode.setState({ ...oldState, system: system?.value })
	})
	providers?.addEventListener("input", () => {
		vscode.setState({ ...oldState, provider: providers?.value })
	})
	models?.addEventListener("input", () => {
		vscode.setState({ ...oldState, model: models?.value })
	})
	prompt.addEventListener("keydown", (event) => {
		if (event.shiftKey && event.key === "Enter") return
		if (event.key === "Enter") {
			event.preventDefault()
			sendPrompt()
			return
		}
	})
	clearChatBtn.addEventListener("click", () => {
		vscode.postMessage({ command: "clearChat" })

		chat.replaceChildren()
	})
	settingsBtn.addEventListener("click", () => {
		vscode.postMessage({ command: "goToSettings" })
	})
	viewSettingsBtn.addEventListener("click", () => {
		vscode.postMessage({ command: "viewSettings" })
	})
	chat?.addEventListener("click", async (e) => {
		if (!e.target.classList.contains("code-block")) return

		const mousePosition = { x: e.clientX, y: e.clientY }
		const copyNotif = copiedNotif(mousePosition)
		const copyText = e.target.innerText

		await copy(copyText, copyNotif)
	})

	// Recieve message from typescript
	window.addEventListener("message", (event) => {
		const message = event.data

		switch (message.command) {
			case "sendResponse": {
				chat.appendChild(chatBox(message.data.model, message.data.prompt))
				chat.scrollTop = chat.scrollHeight
				break
			}
			case "viewSettings": {
				for (let elem = 0; elem < hideSettings.length; elem += 1) {
					if (!hideSettings[elem]) return
					message.data === true
						? hideSettings[elem].classList.remove("hide")
						: hideSettings[elem].classList.add("hide")
				}

				if (message.data === true) {
					document.body.classList.remove("settings-hidden")
					settingsCont.classList.remove("settings-hidden")
				} else {
					document.body.classList.add("settings-hidden")
					settingsCont.classList.add("settings-hidden")
				}
			}
			case "loadChat": {
				const messages = message.data.messages
				messages.forEach((msg) => {
					chat.appendChild(chatBox(msg.role, `${msg.content}`))
				})
				chat.scrollTop = chat.scrollHeight
				system.value = message.data.system
				break
			}
		}
	})

	function sendPrompt() {
		vscode.setState({ ...oldState, idle: false })

		// switchIcon()

		const formData = {
			system: system.value,
			provider: providers.value,
			model: models.value,
			prompt: prompt.value,
		}

		// Send message to typescript
		vscode.postMessage({ command: "sendPrompt", data: formData })

		chat.appendChild(chatBox("User", `${formData.prompt}`))
		chat.scrollTop = chat.scrollHeight

		setTimeout(() => {
			vscode.setState({ ...oldState, idle: true })
			// switchIcon()
		}, 5000)
	}

	// function switchIcon() {
	// 	const icon = document.getElementById("icon")
	// 	const gif = document.getElementById("gif")

	// 	if (vscode.getState().idle === false) {
	// 		icon.hidden = true
	// 		gif.hidden = false
	// 		return
	// 	}

	// 	icon.hidden = false
	// 	gif.hidden = true
	// }

	function chatBox(speaker, text) {
		let msgs = []
		let isCode = false

		text.split("```").forEach((section) => {
			isCode
				? msgs.push({ type: "code", text: section })
				: msgs.push({ type: "normal", text: section })

			isCode = !isCode
		})

		const msgCont = document.createElement("div")
		msgCont.classList.add("input", "message", speaker === "user" ? "user" : "ai")

		const speakerCont = document.createElement("div")
		speakerCont.classList.add("name")
		speakerCont.innerText = speaker

		const textCont = document.createElement("div")
		textCont.classList.add("message-content")

		msgs.forEach((msg) => {
			textCont.append(chatMessage(msg))
		})

		msgCont.append(speakerCont, textCont)

		return msgCont
	}

	function chatMessage(msg) {
		const textCont = document.createElement("span")
		textCont.classList.add(msg.type === "code" ? "code-block" : "text-block")
		textCont.innerHTML = msg.text

		return textCont
	}

	function copiedNotif(mousePosition) {
		const textCont = copyCont.length > 0 ? copyCont[0] : document.createElement("span")

		textCont.classList.add("copied-cont")
		textCont.innerHTML = "copied"
		textCont.style.left = `${mousePosition.x}px`
		textCont.style.top = `${mousePosition.y}px`

		return textCont
	}

	async function copy(text, copyNotif) {
		try {
			await navigator.clipboard.writeText(text)

			chat.appendChild(copyNotif)
			setTimeout(() => {
				if (copyNotif.parentElement === chat) chat.removeChild(copyNotif)
			}, 1500)
		} catch (err) {
			console.error("Failed to copy: ", err)
		}
	}
})()
