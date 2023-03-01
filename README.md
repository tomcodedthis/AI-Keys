# AI-Keys

A VSCode extension to use and manage generative AI from varied sources.

Keep control of your keys, usage and costs directly to the model provider.

---

## Features

### List Models

```md
CMD/CTRL + ALT + M
```

#### Input Box Search

```md
CMD/CTRL + Shift + P

AI-Keys: Search Prompt
```

#### Inline Search

`CMD/CTRL + Alt + /`

#### Set Model Argument

```md
what is ai?

gbt tell a joke

code-search-ada-code-001 write a function that adds 2 numbers
```

### Image Generation

```md
dalle an image of a smiling dog
```

### Configuration Arguments

Multiline prompts are currently only supported for **comments**

```python
# convert

cv javascript def add(x, y) return x + y

# convert javascript 
# def add(x, y):
#   return x + y
```

```typescript
// optimise

op def add(x, y) return x + y

// optimise
// function add(x, y) {
//   return x + y
// }
```

```python
# explain

ex def add(x, y) return x + y

# explain
# def add(x, y):
#   return x + y`
```

---

## Setup

`CMD/CTRL + Shift + P`

`AI-Keys: Open Settings`

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

## Requirements

An active text editor to read and write to.

Atleast one API key from our supported AI sources:

### [OpenAI](https://platform.openai.com/account/api-keys)

GBT-3 (text-generation: low-cost)
Codex (code-generation: free)
DALL·E (imgage-generation: higher-cost)

---

## Extension Settings

- `aikeys.goToSettings`: Open extension settings
- `aikeys.sendLinePrompt`: Send prompts from inline active editor
- `aikeys.sendBoxPrompt`: Send prompts from VSCode input box
- `aikeys.listModels`: List all available models

---

## In-Development

Features currently being worked on:

- Multiple providers (Google, rev.ai)
- Storing secret API keys
- More configuration options

## To-Do

Contributions are widely encouraged, get involved to earn XP

- Write proper tests for pre-release checks
- Stream response [info](https://github.com/openai/openai-node/issues/18)
- More models/source integrations
- More types of generation (tts, video, 3d models)
- More-configuration options

## Known Issues

Please raise any issues / suggestions

Features currently being worked on:

- Multiple providers (Google, rev.ai)
- Storing secret API keys
- More configuration options
