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

## Features with Examples

```md
Inline Search:

CMD/CTRL + Alt + /
```

```md
Input Box Search:

CMD/CTRL + Shift + P

AI-Keys: Search Prompt
```

```md
List Supported Models:

CMD/CTRL + ALT + M
```

```md
Specify Model (no argument defaults to user-defined default):

gbt tell a joke

code-search-ada-code-001 write a function that adds 2 numbers
```

```md
Add Shorthand Arguments (multiline prompts are only supported as comments):

cv javascript def add(x, y) return x + y

# convert javascript

# def add(x, y):

# return x + y

op def add(x, y) return x + y

// optimise
// function add(x, y) {
// return x + y
// }

ex def add(x, y) return x + y

# explain

# def add(x, y):

# return x + y`
```

```md
Image Generation:

dalle a smiling dog
```

```md
Image Recognition (URL's must use HTTPS and local images use absolute paths):

clarify https://samples.clarifai.com/dog2.jpeg

clar /absolute/path/to/local/image.jpeg
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
            <td rowspan=4><a href="https://platform.openai.com/">OpenAI</a></td>
            <td rowspan=2>GBT</td>
            <td>gbt</td>
            <td rowspan=2>Text</td>
            <td rowspan=2><a href="https://openai.com/pricing#language-models">See more</a></td>
        </tr>
        <tr>
            <td>gbt3</td>
        </tr>
        <tr>
            <td>Codex</td>
            <td>codex</td>
            <td>Code</td>
            <td>Free</td>
        </tr>
        <tr>
            <td>DALL·E</td>
            <td>dalle</td>
            <td>Image</td>
            <td><a href="https://openai.com/pricing#image-models">See more</a></td>
        </tr>
        <tr>
            <td rowspan=2><a href="https://www.clarifai.com/">Clarifai</a></td>
            <td rowspan=2>Clarifai</td>
            <td>clarifai</td>
            <td rowspan=2>Image Recognition</td>
            <td>1,000 Free Operations Per/Month</td>
        </tr>
        <tr>
            <td>clar</td>
            <td><a href="https://www.clarifai.com/pricing">See more</a></td>
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

---

## In-Development

Features currently being worked on:

1. Storing secret API keys
2. Support for any Clarifai model (audio, text)
3. More providers
4. More configuration

## To-Do

Contributions are widely encouraged, get involved to earn XP

- Write proper tests for pre-release checks
- Stream response [info](https://github.com/openai/openai-node/issues/18)
- More models/source integrations
- More types of generation (tts, video, 3d models)
- More-configuration options

## Known Issues

Please raise any issues / suggestions

- Multiline prompts not accepted if there is an indent before comment symbol
- Some configurations require the window to be refreshed to take effect
