import * as assert from "assert"
import * as vscode from "vscode"
// import * as extension from '../../extension';

// test = no active editor
// test = no prompt editor
// test = no api key
// test = wrong api key

// test = unrecognised model
// human: say hello

// test = default model
// say hello

// test = change model
// gbt3: say hello
// codex: say hello

// write a function that adds 2 numbers

// gbt : say hello

// to-do - add support for multiline comment and config prompts with no model
// op : 
// def add(x, y):
// return x + y

// cv js :
// def add(x, y):
// return x + y

// codex op : 
// def add(a, b, c, d, e):
// return a + b + c + d + e

suite("Extension Test Suite", () => {
	vscode.window.showInformationMessage("Start all tests.")

	test("Sample test", () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5))
		assert.strictEqual(-1, [1, 2, 3].indexOf(0))
	})
})
