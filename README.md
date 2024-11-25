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
   - 按下 `Ctrl/Cmd + Shift + P`，输入以下命令之一：
     - "open in vscode" - 在 VS Code 中打开
     - "open in cursor" - 在 Cursor 中打开
     - "open in windsur" - 在 WindSur 中打开
     - "open in webstorm" - 在 WebStorm 中打开
   - 在右键菜单中选择对应的选项

## 要求

- VS Code 版本: ^1.90.0
- 如果要使用 WebStorm 功能，需要确保：
  1. WebStorm 已安装
  2. `webstorm` 命令行工具已添加到系统环境变量中

