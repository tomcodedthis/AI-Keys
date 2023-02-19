# AIKeys

## **Features**

A VSCode extension to manage and use AI tools from varied sources.

You supply the key to easily unlock different AI capabilites.

To use:

**1** Comment a prompt to send a request.
**2** Add an optional arugments to configure request (AI Model, Optimize Comment)
**3** Keeping focused on your prompt line, press **CMD** + **Shift** + **?** to search your prompt.

## **Available Models**

| Model  | Prefix | Example                                                             |
| ------ | ------ | ------------------------------------------------------------------- |
| GBT-3  | gbt3   | `gbt3: which ai modei is chatgbt`                                   |
| Codex  | codex  | `codex: write a function that sums a group of numbers`              |
| DALL·E | dalle  | `dalle: create an image of a cartoon celebrating completing a task` |

## **Prefix Options**

| Argumments | Description                                  | Examples           |
| ---------- | -------------------------------------------- | ------------------ |
| op         | Optimise current prompt                      | `gbt3: op`         |
|            |                                              | `codex: op`        |
| cv         | Convert current prompt to specified language | `gbt3: cv python`  |
|            |                                              | `codex: cv python` |

## **Requirements**

Atleast one API key from our listed AI:

#### [OpenAI](https://platform.openai.com/account/api-keys)

    GBT-3 (text-generation: low-cost)
    Codex (code-generation: free)
    DALL·E (imgage-generation: low-cost)

## **Extension Settings**

- `aikeys.goToSettings`: Open extension settings.
- `aikeys.sendPrompt`: Sends a request to user-configured AI Model (Default: gbt3)

## **Known Issues**

Please raise any issues / suggestions

## **To-Do**

- More AI Model integrations
- Smoother prompt input and response handling (in-progress)
- Add auto completion for arguments
- Add keyboard shortcuts
- More-configuration options:
  - Specific fine-tuned models
  - Train own models

## **Release Notes**

### 0.0.1

Initial release of AIKeys
