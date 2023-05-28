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
	const sendBtn = document.getElementById("prompt-btn")
	const prompt = document.getElementById("prompt-text")
	const system = document.getElementById("system")
	const providers = document.getElementById("providers")
	const modelsText = document.getElementById("models-text")
	const clearChatBtn = document.getElementById("clear-chat-btn")
	const settingsBtn = document.getElementById("settings-btn")
	const notifCont = document.getElementById("notif-cont")
	const toggleBtns = document.getElementsByClassName("toggle-btn")

	sendBtn.addEventListener("click", () => {
		sendPrompt()
	})
	providers.addEventListener("input", () => {
		vscode.postMessage({ command: "changeProvider", data: { provider: providers.value } })
	})
	modelsText.addEventListener("input", () => {
		vscode.postMessage({
			command: "changeModel",
			data: {
				provider: providers.value,
				model: modelsText.value,
			},
		})
	})
	system.addEventListener("input", () => {
		vscode.postMessage({ command: "changeSystem", data: { system: system.value } })
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
	chat.addEventListener("click", async (e) => {
		if (!e.target.classList.contains("code-block")) return
		try {
			await navigator.clipboard.writeText(e.target.innerText)
			const mousePosition = { x: e.clientX, y: e.clientY }
			notify("copied", mousePosition, "copy", undefined)
		} catch (err) {
			console.error("Failed to copy: ", err)
		}
	})

	for (const btn of toggleBtns) {
		btn.addEventListener("mouseenter", async (e) => {
			const target = e.target.tagName === "I" ? e.target.parentElement : e.target
			const pos = target.getBoundingClientRect(target)
			const mousePosition = { x: pos.x, y: pos.y }
			const name = target.id
				.split("-")
				.filter((word) => {
					return word !== "btn"
				})
				.join(" ")
				.toUpperCase()

			notify(name, mousePosition, "hover", pos)
		})
		btn.addEventListener("mouseout", async (e) => {
			if (!notifCont.classList.contains("hide")) notifCont.classList.add("hide")
		})
	}

	// Recieve message from typescript
	window.addEventListener("message", (event) => {
		const message = event.data

		switch (message.command) {
			case "sendResponse": {
				chat.appendChild(chatBox(message.data.model, message.data.prompt))
				chat.scrollTop = chat.scrollHeight
				break
			}
			case "loadChat": {
				const messages = message.data.messages

				if (!messages) return

				messages.forEach((msg) => {
					if (msg.role === "system") return
					chat.appendChild(chatBox(msg.role, msg.content))
				})
				chat.scrollTop = chat.scrollHeight
				system.value = message.data.system
				break
			}
			case "changeProvider": {
				const provider = message.data.provider.toLowerCase()
				const model = message.data.model

				providers.value = provider
				modelsText.value = model
				modelsText.placeholder = `${provider} model id...`

				if (provider === "openai") {
					system.parentElement.classList.remove("hide")
					document.body.classList.remove("system-hidden")
					break
				}

				system.parentElement.classList.add("hide")
				document.body.classList.add("system-hidden")
				break
			}
		}
	})

	function sendPrompt() {
		vscode.setState({ ...oldState, idle: false })

		const formData = {
			system: system.value,
			provider: providers.value,
			model: modelsText.value,
			prompt: prompt.value,
		}

		// Send message to typescript
		vscode.postMessage({ command: "sendPrompt", data: formData })

		chat.appendChild(chatBox("user", `${formData.prompt}`))
		chat.scrollTop = chat.scrollHeight
	}

	function chatBox(speaker, text) {
		let msgs = []
		let isCode = false
		console.log("speaker:", speaker)
		let isHTML = speaker === "dalle" ? true : false

		const msgCont = document.createElement("div")
		msgCont.classList.add("input", "message", speaker === "user" ? "user" : "ai")

		const speakerCont = document.createElement("div")
		speakerCont.classList.add("name")
		speakerCont.innerText = speaker

		const textCont = document.createElement("div")
		textCont.classList.add("message-content")

		text.split("```").forEach((section) => {
			section = section.split("\n").join("\n")
			isCode
				? msgs.push({ type: "code", text: section })
				: msgs.push({ type: "normal", text: section })

			isCode = !isCode
		})

		msgs.forEach((msg) => {
			textCont.append(chatMessage(msg, isHTML))
		})

		msgCont.append(speakerCont, textCont)

		return msgCont
	}

	function chatMessage(msg, isHTML) {
		const isCode = msg.type === "code"
		const COMMON_PROGRAMING_LANGUAGES = [
			"javascript",
			"typescript",
			"python",
			"css",
			"html",
			"c++",
			"c#",
			"c",
		]
		const textCont = document.createElement(isCode ? "code" : "div")
		let firstWord = msg.text.split(" ")[0].split("\n")[0].split("<br>")[0].trim()

		textCont.classList.add(isCode ? "code-block" : "text-block")
		console.log("isHTML:", isHTML)

		if (isCode && COMMON_PROGRAMING_LANGUAGES.includes(firstWord)) {
			msg.text = msg.text.replace(`${firstWord}`, " ").trim()
			msg.text = msg.text.replace(`<br><br>`, " ").trim()

			firstWord = msg.text.split(">")[0]
			if (firstWord === "<br" || firstWord === "\n")
				msg.text = msg.text.split(">").slice(1).join(">")
		}

		if (isHTML) {
			msg.text.split("\n").filter(word => word !== "\n").join("<br>")
			textCont.innerHTML = msg.text.trim()
		} else {
			msg.text.split("<br>").filter(word => word !== "<br>").join("\n")
			textCont.innerText = msg.text.trim()
		}

		return textCont
	}

	function notify(text, mousePosition, type, target) {
		notifCont.innerText = text
		notifCont.style.left = `${mousePosition.x}px`
		notifCont.style.top = `${mousePosition.y - 25}px`

		target ? (notifCont.style.width = `${target.width}px`) : (notifCont.style.width = "fit-content")

		if (notifCont.classList.contains("hide")) notifCont.classList.remove("hide")
		if (type === "copy")
			setTimeout(() => {
				if (!notifCont.classList.contains("hide")) notifCont.classList.add("hide")
			}, 1500)
	}
})()
