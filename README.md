# anyformatter-vscode

English | [简体中文](README-zh_CN.md)

VS Code extension for formatting any file using external command.

## Usage

1. Install from marketplace: <https://marketplace.visualstudio.com/items?itemName=lxl66566.anyformatter-vscode>
2. Set anyformatter as default formatter for the languages you want:
   ```json
   "[toml]": {
     "editor.defaultFormatter": "lxl66566.anyformatter-vscode"
   },
   "[nix]": {
     "editor.defaultFormatter": "lxl66566.anyformatter-vscode"
   },
   ```

Then: ↓↓↓

### stdin and stdout

If the external formatter accepts stdin and outputs to stdout:

```json
"anyformatter": {
  "toml": { "command": "taplo fmt -" },
  "nix": { "command": "nixfmt -" }
},
```

That's simple.

### file

If your external formatter cannot use stdin/stdout, and must be called with a file path:

```json
"anyformatter": {
  "toml": {
    "command": "taplo fmt",
    "file": true,
  }
  "[toml]": {
    "editor.formatOnSave": false  // important!
  },
},
```

the command will be executed as `taplo fmt "<file_path>"`.

**Note that** the `formatOnSave` setting must be set to `false`, because we need to _save_ first, then _format_, but the vscode `formatOnSave` will trigger _format_ first, and then _save_.

If you still want to format on save, you can use the `format_on_save` option provided by this extension:

```json
"anyformatter": {
  "toml": {
    "command": "taplo fmt",
    "file": true,
    "format_on_save": true
  }
  "[toml]": {
    "editor.formatOnSave": false
  },
},
```
