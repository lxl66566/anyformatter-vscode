# anyformatter-vscode

VS Code extension for formatting any file using external command.

## Usage

1. Install <https://github.com/lxl66566/anyformatter-vscode>
2. Edit `settings.json` to add your formatter command and arguments. Example:
   ```json
   "anyformatter": {
     "toml": { "command": "taplo fmt -" },
     "nix": { "command": "nixfmt -" }
   },
   ```
3. Set anyformatter as default formatter.
   ```json
   "[toml]": {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "lxl66566.anyformatter-vscode"
   },
   "[nix]": {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "lxl66566.anyformatter-vscode"
   },
   ```

Note that the external formatter must be able to accept stdin and output to stdout.
