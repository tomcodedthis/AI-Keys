# AI-Keys

A VSCode extension to use and manage generative AI from varied sources.

Keep control of your keys, usage and costs directly to the model provider.

- [Features with Examples](https://github.com/tomcodedthis/AI-Keys#features-with-examples)
- [Setup](https://github.com/tomcodedthis/AI-Keys#setup)
- [Requirements](https://github.com/tomcodedthis/AI-Keys#requirements)
- [Extension Commands](https://github.com/tomcodedthis/AI-Keys#extension-commands)
- [In-Development](https://github.com/tomcodedthis/AI-Keys#in-development)
- [To-Do](https://github.com/tomcodedthis/AI-Keys#to-do)
- [Known Issues](https://github.com/tomcodedthis/AI-Keys#known-issues)

---

## New Features

### Chat

![Chat](https://github.com/tomcodedthis/AI-Keys/blob/develop/media/gif/aikeys-demo.gif?raw=true)

### Hugging Face Support

- Speech to Text *(ensure you've set a automatic-speech-recognition model)*
` facebook/wav2vec2-large-960h-lv60-self) ` 
` hf /PATH/TO/AUDIO/file.mp3 `
- Text *(ensure you've set a text-based model)* ` gpt2 `
- Translation *(ensure you've set a translation-based model)* ` t5-base `
- Change model: ` hf model = gpt2 `

### OpenAI

- Chat (GPT-3.5-Turbo):
  - Change system role (define how it behaves)
  - Reset chat (reduce token usage) ` clearChat `

- Image Generation (Dalle) ` dalle a smiling dog `

### Clarifai

- Image Recognintion:

```md
clarifai https://samples.clarifai.com/dog2.jpeg

clar /LOCAL/FILE/PATH/image.webp
```

## Features with Examples

- Chat

![Chat](https://github.com/tomcodedthis/AI-Keys/blob/develop/media/images/aikeys-chat.png?raw=true)

- Inline Search ` CMD/CTRL + Enter ` or ` CMD/CTRL + Alt + / `
- Specify Model *(optional, unspecified uses default model)*:
` gpt tell a joke `
` code-search-ada-code-001 write a function that adds 2 numbers `
- List Supported Models ` CMD/CTRL + ALT + M `
- Shorthand Arguments (multiline prompts are only supported as comments):

```md
convert / cv
# cv javascript
# def add(x, y):
# return x + y
```

```md
optimise / op
// op
// function add(x, y) {
// return x + y
// }
```

```md
explain / ex
# ex
# def add(x, y):
# return x + y`
```

- Input Box Search

```md
CMD/CTRL + Shift + P

AI-Keys: Search Prompt
```

---

## Setup

- Set API Keys and default configuration ` CMD/CTRL + Shift + P ` ` AI-Keys: Open Settings `

---

<!-- markdownlint-disable -->
<table>
    <thead>
        <tr>
            <th>Provider</th>
            <th>Model</th>
            <th>Prefix</th>
            <th>Type</th>
            <th>Cost</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan=3><a href="https://platform.openai.com/">OpenAI</a></td>
            <td>GPT-3.5-Turbo</td>
            <td>gpt</td>
            <td>Chat</td>
            <td rowspan=2><a href="https://openai.com/pricing#language-models">See more</a></td>
        </tr>
        <tr>
            <td>GPT3</td>
            <td>gpt3</td>
            <td>Text</td>
        </tr>
        <tr>
            <td>DALL·E</td>
            <td>dalle</td>
            <td>Image</td>
            <td><a href="https://openai.com/pricing#image-models">See more</a></td>
        </tr>
        <tr>
            <td rowspan=2><a href="https://www.clarifai.com/">Clarifai</a></td>
            <td rowspan=2>Any</td>
            <td>clarifai</td>
            <td rowspan=2>Image Recognition</td>
            <td>1,000 Free Operations per month</td>
        </tr>
        <tr>
            <td>clar</td>
            <td><a href="https://www.clarifai.com/pricing">See more</a></td>
        </tr>
        <tr>
            <td rowspan=3><a href="https://huggingface.co/">Hugging Face</a></td>
            <td rowspan=3>Any</td>
            <td>huggingface</td>
            <td rowspan=3>Text, Translation, Speech Recognition</td>
            <td>30,000 Free Prompt Characters per month</td>
        </tr>
        <tr>
            <td>hf</td>
            <td rowspan=2><a href="https://huggingface.co/docs/hub/security-tokens">See more</a></td>
        </tr>
        <tr>
            <td>hface</td>
        </tr>
    </tbody>
</table>
<!-- markdownlint-restore -->

---

## Requirements

An active text editor to read and write to.

At least one API key from our supported AI sources:

### [OpenAI](https://platform.openai.com/account/api-keys)

### [Hugging Face](https://huggingface.co/docs/hub/security-tokens)

### [Clarifai](https://docs.clarifai.com/clarifai-basics/authentication/personal-access-tokens/)

---

## Extension Commands

- `aikeys.goToSettings`: Open extension settings
- `aikeys.sendLinePrompt`: Send prompts from inline active editor
- `aikeys.sendBoxPrompt`: Send prompts from VSCode input box
- `aikeys.listModels`: List all available models
- `aikeys.clearChat`: Clear chat history with GPT

---

## In-Development

Features currently being worked on:

1. Improved chat
2. More support for Hugging Face
3. Storing secret API keys
4. Support for any Clarifai model (audio, text)
5. More configuration

## To-Do

Contributions are widely encouraged, get involved to earn XP (high/mid/low prioirty)

- Improved UX of chat window (high)
- Write proper tests for pre-release checks (high)
- Add vscode walkthrough (high)
- Store secret API keys (high)
- Export as Chrome extension (mid)
- Export as Logic extension (mid)
- More models/source integrations (mid)
- More types of generation (tts, video, 3d models) (mid)
- Stream response [info](https://github.com/openai/openai-node/issues/18) (low)

## Known Issues

Please raise any issues / suggestions

- Multiline prompts not accepted if there is an indent before comment symbol
- Some configurations require the window to be refreshed to take effect
