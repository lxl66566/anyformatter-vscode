# anyformatter-vscode

[English](README.md) | 简体中文

VS Code 插件，用于使用外部自定义命令格式化任意文件。

## 使用方法

1. 安装插件 anyformatter：<https://marketplace.visualstudio.com/items?itemName=lxl66566.anyformatter-vscode>。
2. 将对应语言的 `editor.defaultFormatter` 设为本插件。
   ```json
   "[toml]": {
     "editor.defaultFormatter": "lxl66566.anyformatter-vscode"
   },
   "[nix]": {
     "editor.defaultFormatter": "lxl66566.anyformatter-vscode"
   },
   ```
3. 请看下文 **↓↓↓ 所有更改都必须重启扩展才能生效**。

### stdin and stdout

如果你的外部命令接受 stdin 并输出 stdout，你可以简单地设置：

```json
"anyformatter": {
  "toml": { "command": "taplo fmt -" },
  "nix": { "command": "nixfmt -" }
},
```

### 文件格式化

如果你的外部命令不支持 stdin/stdout，而只能接受文件路径，你可以：

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

命令将被执行为 `taplo fmt "<file_path>"`。（命令被添加了空格与双引号，放到尾部）

**注意**，该语言的 `formatOnSave` 选项必须设为 `false`，因为我们需要先 _保存_ 再 _格式化_，但 vscode 的`formatOnSave` 会先触发 _格式化_ 再触发 _保存_。于是文件两个版本冲突了。

如果你确实需要文件格式化与 format on save 一起工作，你可以使用本插件提供的 `format_on_save` 选项：

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

这样就可以在保存时自动格式化文件了。此时的 key(`"toml"`) 会匹配文件后缀而不是 `languageId`。
