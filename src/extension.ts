// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { exec } from "child_process";

// 创建一个通用的打开编辑器函数
async function openInEditor(cliCommand: string) {
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		vscode.window.showErrorMessage("没有打开的编辑器！");
		return;
	}

	const document = editor.document;
	const position = editor.selection.active;
	const filePath = document.uri.fsPath;
	const line = position.line + 1;
	const column = position.character + 1;

	// 获取工作区根目录
	let workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
	if (!workspaceFolder) {
		vscode.window.showErrorMessage("无法获取工作区目录！");
		return;
	}

	const workspacePath = workspaceFolder.uri.fsPath;

	try {
		// 先打开工程
		await new Promise((resolve, reject) => {
			exec(`${cliCommand} "${workspacePath}"`, (error) => {
				if (error) {
					reject(error);
					return;
				}
				// 等待一小段时间确保工程已经打开
				setTimeout(resolve, 3000);
			});
		});

		// 然后打开具体文件和位置
		await new Promise((resolve, reject) => {
			const openFileCommand = `${cliCommand} --goto "${filePath}:${line}:${column}"`;
			exec(openFileCommand, (error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(null);
			});
		});

		vscode.window.showInformationMessage(
			`已在${cliCommand}中打开位置: ${filePath}:${line}:${column}`
		);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		vscode.window.showErrorMessage(`执行命令失败: ${errorMessage}`);
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sync-editor" is now active!');

	// 注册三个不同的命令
	const openInVSCode = vscode.commands.registerCommand(
		"sync-editor.openInVSCode",
		() => openInEditor("code")
	);

	const openInCursor = vscode.commands.registerCommand(
		"sync-editor.openInCursor",
		() => openInEditor("cursor")
	);

	const openInWindsur = vscode.commands.registerCommand(
		"sync-editor.openInWindsur",
		() => openInEditor("windsur")
	);

	// 将所有命令添加到订阅列表
	context.subscriptions.push(openInVSCode, openInCursor, openInWindsur);
}

// This method is called when your extension is deactivated
export function deactivate() { }
