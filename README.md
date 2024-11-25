# Sync Editor

Sync Editor 是一个 VS Code 扩展，它允许你在不同的编辑器之间同步打开相同的文件和位置。目前支持在 VS Code、Cursor 和 WindSur 编辑器之间进行同步。

## 功能特点

- 在不同编辑器间同步打开相同的文件
- 精确定位到相同的行和列
- 支持多种编辑器：
  - VS Code
  - Cursor
  - WindSur

## 安装

1. 打开 VS Code
2. 进入扩展市场
3. 搜索 "Sync Editor"
4. 点击安装

## 使用方法

1. 在 VS Code 中打开一个文件
2. 使用以下方式之一触发命令：
   - 按下 `Ctrl/Cmd + Shift + P`，输入 "open in vscode"
   - 在右键菜单中选择 "open in vscode"

## 配置选项

在 VS Code 设置中，你可以配置以下选项：

- `sync-editor.cliCommand`: 选择要使用的命令行工具
  - `cursor`: 使用 Cursor 编辑器（默认）
  - `code`: 使用 VS Code
  - `windsur`: 使用 WindSur 编辑器

配置示例：
```json
{
  "sync-editor.cliCommand": "cursor"
}
```

