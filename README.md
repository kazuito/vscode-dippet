# Dippet - The Dynamic Snippet

Use snippets as command triggers.

## Configuration

The default does nothing, so create your own snippet in the `settings.json`.

```jsonc
"dippet.entry": {
  "javascript": [ // Language ID
    {
      "prefix": "uuid",
      "description": "Generate UUID",
      "body": "", // Can be omitted as it is empty.
      "command": ["cmd: uuid.generate", "cmd: cursorRight"]
    }
  ]
}
```
*The command uuid.generate in this example requires [UUID Generator](https://marketplace.visualstudio.com/items?itemName=netcorext.uuid-generator).

### Scope

`Language ID` : The language of snippets applied. You can specify "*" to apply to all languages.

### Snippet

- `prefix` : The trigger word for its snippet.

- `description` : Description for its snippet. Displayed when its snippet is suggested.

- `body` : Body of its snippet.

- `command` : Tasks to be executed when using its snippet.

  Command types

  - `cmd` : ID of command. (e.g. `cmd: workbench.action.files.save`)
  - `shell` : Shell command to be executed in the terminal. (e.g. `shell: echo Hello`)

You can omit anything other than `prefix` that you do not need.


