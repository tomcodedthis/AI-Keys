;(function () {
	const vscode = acquireVsCodeApi()
	const oldState = vscode.getState() || {
		idle: true,
		system: "",
		provider: "",
		model: "",
		prompt: "",
		messages: []
	}

	const chat = document.getElementById("chat")
	const btn = document.getElementById("prompt-btn")
	const prompt = document.getElementById("prompt-text")
	const system = document.getElementById("system")
	const providers = document.getElementById("providers")
	const models = document.getElementById("models")
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
	prompt.addEventListener("keydown", (event => {
		if (event.shiftKey && event.key === "Enter") return
		if (event.key === "Enter") {
			event.preventDefault()
			sendPrompt()
			return
		}
	}))

	// Recieve message typescript
	window.addEventListener("message", (event) => {
		const message = event.data
		switch (message.command) {
			case "sendResponse": {
				console.log(message.data)
				chat.appendChild(createMessage(message.data.model, message.data.prompt))

				break
			}
		}
	})

	function sendPrompt() {
		vscode.setState({ ...oldState, idle: false })
		switchIcon()

		const formData = {
			system: oldState.system || system.value,
			provider: providers.value,
			model: models.value,
			prompt: prompt.value,
		}

		// Send message typescript
		vscode.postMessage({ command: "sendPrompt", data: formData })

		chat.appendChild(createMessage("User", `${formData.prompt}`))

		setTimeout(() => {
			vscode.setState({ ...oldState, idle: true })
			switchIcon()
		}, 5000)
	}

	function switchIcon() {
		const icon = document.getElementById("icon")
		const gif = document.getElementById("gif")

		if (vscode.getState().idle === false) {
			icon.hidden = true
			gif.hidden = false
		} else {
			icon.hidden = false
			gif.hidden = true
		}
	}

	function createMessage(speaker, text) {
		const msgCont = document.createElement("div")
		msgCont.classList.add("input", "message", speaker === "User" ? "user" : "ai")

		const speakerCont = document.createElement("div")
		speakerCont.classList.add("name")
		speakerCont.innerText = speaker

		const textCont = document.createElement("div")
		textCont.innerText = text

		msgCont.append(speakerCont, textCont)

		return msgCont
	}
})()
