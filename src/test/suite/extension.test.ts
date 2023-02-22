import * as assert from "assert"
import * as vscode from "vscode"
// import * as extension from '../../extension';

// ### to-do add proper testing

// # test = no active editor
// # test = no prompt editor
// # test = no api key
// # test = wrong api key
// # test = no comment

// # test = unrecognised model
// # human: say hello

// # test = default model
// # say hello
// # codex: say hello

// # test = change model
// # gbt3: say hello
// # gbt : say hello

// # test = multiline response as comment
// # write a function that adds 2 numbers and returns the sum

// # test = image url
// # dalle: a smiling dog

// # test = arguments
// # codex op : def function add(x, y, z): return x + y + z

// ### to-do - add support for multiline comment prompts config prompts with no model

// # gbt op : def function add(x, y, z): return x + y + z

// # op : def function add(x, y, z): return x + y + z

// # op :
// # def add(x, y):
// # return x + y

// # cv js :
// # def add(x, y):
// # return x + y

// # codex op :
// # def add(a, b, c, d, e):
// # return a + b + c + d + e


suite("Extension Test Suite", () => {
	vscode.window.showInformationMessage("Start all tests.")

	test("Sample test", () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5))
		assert.strictEqual(-1, [1, 2, 3].indexOf(0))
	})
})
