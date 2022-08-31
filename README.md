# Dippet - The Dynamic Snippet

Use snippets as command triggers.

## Configuration

In `settings.json`

```json
"dippet.entry": {
  "javascript": [ // Language ID
    {
      "prefix": "uuid",
      "description": "Generate UUID",
      "body": "",
      "command": "uuid.generate"
    }
  ]
}
```
*The command `uuid.generate` in this example requires [UUID Generator](https://marketplace.visualstudio.com/items?itemName=netcorext.uuid-generator).

`Language ID` : The language of snippets applied. You can specify `"*"` to apply to all languages.

- `prefix` : The trigger word for its snippet.

- `description` : Description for its snippet. Displayed when its snippet is suggested.

- `body` : Body of its snippet.

- `command` : ID of the command to be executed when using its snippet.

You can omit anything other than `prefix` that you do not need.


