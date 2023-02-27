# AI-Keys

A VSCode extension to use and manage generative AI from varied sources.

Keep control of your keys, usage and costs directly to the model provider.

---

## Features

### List Models

`CMD/CTRL + ALT + M`

### Input Box Search

`CMD/CTRL + Shift + P`

Search for `AI-Keys: Search Prompt`

### Inline Search

Focus your prompt line

`CMD/CTRL + Shift + ?`

### Default Model

```md
what is ai?
```

### Specific Default Model

```md
gbt tell a joke
```

### Any Available Model

```md
code-search-ada-code-001 write a function that adds 2 numbers
```

### Image Generation

```md
dalle an image of a smiling dog
```

### Configuration Arguments

#### convert

```python
cv javascript def add(x, y) return x + y

# convert javascript 
# def add(x, y):
#   return x + y
```

#### optimise/optimize

```typescript
op def add(x, y) return x + y

// optimise
// function add(x, y) {
//   return x + y
// }
```

#### explain

```python
ex def add(x, y) return x + y

# explain
# def add(x, y):
#   return x + y`
```

---

## Usage

Multiline prompts are currently only supported for **comments**

### Setup

`CMD/CTRL + Shift + P`

Search for `AI-Keys: Open Settings`

- Set API Keys and default configuration:
  
![AI-Keys Settings](https://github.com/tomcodedthis/AI-Keys/blob/main/images/aikeys-settings.png?raw=true)

---

| Model  | Prefix | Example |
| ------ | ------ | ------- |
| GBT-3  | `gbt` / `gbt3` | `gbt what is ai model gbt3` |
| | | `gbt3 what is ai model gbt` |
| Codex  | `codex` | `codex write a function that sums an array of numbers` |
| DALL·E | `dalle` | `dalle a smiling dog` |

---

| Argumment | Examples | Description |
| ---------- | ----------- | -------- |
| optimise/ze | `optimise` / `gbt3 op` | Optimise prompt |
| convert | `cv python` / `codex cv typescript` | Convert prompt to specified language |
| explain | `explain` / `gbt3 ex` | Explain prompt |

---

## Requirements

An active text editor to read and write to.

Atleast one API key from our supported AI providers:

### [OpenAI](https://platform.openai.com/account/api-keys)

GBT-3 (text-generation: low-cost but more accurate)
Codex (code-generation: free)
DALL·E (imgage-generation: higher-cost)

---

## Extension Settings

- `aikeys.goToSettings`: Open extension settings
- `aikeys.sendLinePrompt`: Send prompts from inline active editor
- `aikeys.sendBoxPrompt`: Send prompts from VSCode input box
- `aikeys.listModels`: List all available models

---

## Known Issues

Please raise any issues / suggestions

### To-Do

Contributions are widely encouraged, get involved to earn XP

- Write proper tests for pre-release checks
- Stream response [info](https://github.com/openai/openai-node/issues/18)
- More models/provider integrations
- More types of generation (tts, video, 3d models)
- Add auto completion for arguments
- Support for fine-tuned models
- More-configuration options:
  - Train own models

---

## In-Development

Features currently being worked on:

- Multiple providers (Google, rev.ai)
- Storing secret API keys
- More configuration options

---

## Release Notes

### 0.0.1-0.0.2

Initial release of AIKeys

### 0.0.3

Support for fine-tuned models
