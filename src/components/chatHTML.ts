import * as vscode from "vscode"
import { ACTIVE_PROVIDER, PROVIDERS_DEFAULT } from "../utils/configuration"

export function chatHTMl(webview: vscode.Webview, extensionUri: vscode.Uri) {
	const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", "main.js"))
	const styleResetUri = webview.asWebviewUri(
		vscode.Uri.joinPath(extensionUri, "media/css", "reset.css")
	)
	const styleVSCodeUri = webview.asWebviewUri(
		vscode.Uri.joinPath(extensionUri, "media/css", "vscode.css")
	)
	const styleMainUri = webview.asWebviewUri(
		vscode.Uri.joinPath(extensionUri, "media/css", "main.css")
	)

	return /*html*/ `
		<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<link href="${styleResetUri}" rel="stylesheet">
					<link href="${styleVSCodeUri}" rel="stylesheet">
					<link href="${styleMainUri}" rel="stylesheet">
					<title>AI Keys</title>
				</head>

				${body()}

				<script src="${scriptUri}" type="module"></script>
				<script src="https://kit.fontawesome.com/e31209f1bd.js" crossorigin="anonymous"></script>
			</html>
	`
}

export function body() {
	return /*html*/ `
		<body class="body">
			${chat()}
			${settings()}
			<span id="notif-cont" class="notif-cont hide"></span>
		</body>
	`
}

export function chat() {
	return /*html*/ `
		<div class="response-cont">
			<div
				id="chat"
				class="chat"
			></div>

			<div class="chat-bottom">
				<a 
					href="https://github.com/tomcodedthis/AI-Keys#setup"
					id="info-link"
					style="color: none"
				>
					<button 
						id="info-btn"
						class="toggle-btn"
					>
						<i class="fa-solid fa-circle-info fa-lg toggle-btn"></i>
					</button>
				</a>

				<button
					id="clear-chat-btn"
					class="toggle-btn"
				>
					<i class="fa-solid fa-ban fa-lg toggle-btn"></i>
				</button>

				<button
					id="settings-btn"
					class="toggle-btn"
				>
					<i class="fa-solid fa-cog fa-lg toggle-btn"></i>
				</button>
			</div>
		</div>
	`
}

export function settings() {
	return /*html*/ `
		<div 
			id="settings-cont"
			class="settings-cont"
		>
			<label
				for="providers"
				class="span-cols-var hide-settings"
			>
				Provider
				<select
					name="providers"
					id="providers"
				>
					${PROVIDERS_DEFAULT.map((provider) => {
						return option(provider.name, provider.label)
					})}
				</select>
			</label>

			<label
				for="models"
				class="span-cols-var hide-settings"
			>
				Model

				<input
					name="models"
					placeholder="${ACTIVE_PROVIDER} name/id..."
					id="models-text"
				/>
			</label>

			<label 
				for="system"
				class="span-cols hide-settings"
			>
				System

				<input
					id="system"
					placeholder="You are a helpful assistant..."
					type="text"
				/>
			</label>

			<textarea
				id="prompt-text"
				class="span-cols"
				placeholder="What is a good prompt to write as an example?"
			></textarea>

			<button
				type="button"
				id="prompt-btn"
				class="span-cols"
			>
				Send Prompt
			</button>
		</div>
	`
}

export function option(name: string, label: string) {
	return `
		<option value="${name}" class="provider-option">${label}</option>`
}

export function icon() {
	return `
		<div class="icon">
			<svg
				version="1.0"
				width="50"
				height="100"
				viewBox="0 0 150 100"
				preserveAspectRatio="xMinYMin"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:svg="http://www.w3.org/2000/svg">
				<g
					transform="matrix(0.02096035,0,0,-0.01971605,-8.0608874,187.81277)"
					fill="#000000"
					stroke="none"
					id="g451">

					<ellipse
						class="bg-text"
						style="fill:#ffffff;fill-opacity:0.8;stroke-width:0.607047"
						id="path264"
						cx="68.098839"
						cy="59.883148"
						rx="36.94989"
						ry="38.290531"
						transform="matrix(47.709128,0,0,-50.7201,384.5779,9525.8822)" />
					<ellipse
						class="bg-text"
						style="fill:#ffffff;fill-opacity:0.8;stroke-width:24.19"
						id="path264-4"
						cx="3679.6968"
						cy="666.69891"
						rx="2094.0894"
						ry="1072.8441" />
					<path
						class="bg-main"
						d="M 3350,9176 C 2639,9048 2038,8732 1528,8218 1442,8132 1397,8074 1303,7932 627,6912 514,5956 958,4999 c 141,-304 419,-705 687,-988 134,-142 477,-395 720,-533 336,-190 667,-306 1045,-364 160,-25 546,-25 715,-1 436,64 897,235 1315,486 192,116 488,370 675,580 676,760 897,1629 684,2701 -32,164 -61,247 -154,450 -418,911 -1069,1496 -1935,1739 -315,88 -565,121 -950,127 -257,3 -284,2 -410,-20 z m 532,-1281 c 333,-50 599,-182 846,-419 132,-127 193,-210 271,-368 78,-159 120,-278 153,-431 32,-150 32,-447 0,-597 -32,-148 -83,-293 -151,-434 -50,-102 -72,-135 -141,-209 -259,-277 -566,-458 -893,-529 -84,-18 -135,-22 -282,-22 -257,0 -431,35 -710,144 -123,48 -174,86 -335,249 -521,526 -616,1147 -284,1860 152,326 543,631 944,736 36,10 90,21 120,25 98,13 360,11 462,-5 z"
						id="path445"
						transform="translate(5.4844983e-6,1.2722329e-4)" />
					<path
						class="bg-main"
						d="m 4019,7008 c -99,-68 -217,-190 -256,-263 -64,-121 -79,-244 -47,-369 22,-86 93,-217 167,-311 58,-73 70,-83 133,-108 263,-105 509,-54 700,145 45,47 54,63 72,133 128,498 -46,762 -540,815 -147,15 -147,15 -229,-42 z"
						id="path447"
						transform="translate(5.4844983e-6,1.2722329e-4)" />
					<path
						class="bg-main"
						d="m 1576,1903 -609,-3 -72,-54 -72,-54 -7,-739 C 813,647 807,244 803,158 L 797,0 h 1092 1092 l -5,33 c -3,17 -13,95 -21,172 -9,77 -29,234 -46,350 -29,208 -30,210 -83,320 -54,110 -106,251 -106,286 0,18 27,19 1020,19 561,0 1020,-3 1020,-7 0,-5 -14,-42 -31,-83 C 4621,826 4554,491 4534,127 L 4527,0 h 1123 1123 l -6,897 c -6,778 -9,898 -22,913 -25,27 -100,60 -161,70 -32,5 -772,12 -1713,15 -911,3 -1888,6 -2171,8 -283,1 -789,1 -1124,0 z"
						id="path449"
						transform="translate(5.4844983e-6,1.2722329e-4)" />
				</g>
			</svg>
		</div>
	`
}
