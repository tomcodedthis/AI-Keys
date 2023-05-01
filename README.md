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

`Chat Demo (Pre-Release)`

![Chat](https://github.com/tomcodedthis/AI-Keys/blob/develop/media/gif/aikeys-demo.gif?raw=true)

```md
Hugging Face Support

Change model:

hf model = gpt2

Translation (ensure you've set a translation model, e.g. t5-base):

hf hello, how are you?

Speech to Text (ensure you've set a automatic-speech-recognition model, e.g. facebook/wav2vec2-large-960h-lv60-self):

hf /PATH/TO/AUDIO/file.mp3

```

```md
Chat using GPT-3.5-Turbo (define how it behaves in your AI-Keys configuration settings):

write a joke

think of a better one

repeat the first one

Reset chat (reduce token usage):

clearChat

```

```md
Image Recognintion:

clarifai https://samples.clarifai.com/dog2.jpeg

clar /LOCAL/FILE/PATH/image.webp
```

```md
Image Generation:

dalle a smiling dog
```

## Features with Examples

```md
Inline Search:

CMD/CTRL + Enter

or

CMD/CTRL + Alt + /
```

```md
Specify Model ( optional, unspecified uses default model ):

gpt tell a joke

code-search-ada-code-001 write a function that adds 2 numbers
```

```md
List Supported Models:

CMD/CTRL + ALT + M
```

```md
Shorthand Arguments (multiline prompts are only supported as comments):

convert / cv
# cv javascript
# def add(x, y):
# return x + y


optimise / op
// op
// function add(x, y) {
// return x + y
// }

explain / ex
# ex
# def add(x, y):
# return x + y`
```

```md
Input Box Search:

CMD/CTRL + Shift + P

AI-Keys: Search Prompt
```

---

## Setup

```md
Set API Keys and default configuration:

CMD/CTRL + Shift + P

AI-Keys: Open Settings
```

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

Contributions are widely encouraged, get involved to earn XP

- Fully operational chat window
- Write proper tests for pre-release checks
- Stream response [info](https://github.com/openai/openai-node/issues/18)
- More models/source integrations
- More types of generation (tts, video, 3d models)

## Known Issues

Please raise any issues / suggestions

- Multiline prompts not accepted if there is an indent before comment symbol
- Some configurations require the window to be refreshed to take effect
