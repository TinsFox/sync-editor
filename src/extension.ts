// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { exec } from "child_process";
import * as path from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sync-editor" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand(
		"sync-editor.openInCli",
		async () => {
			// 获取配置的命令
			const config = vscode.workspace.getConfiguration('sync-editor');
			const cliCommand = config.get('cliCommand', 'cursor');

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

			// 先打开工程，然后打开文件
			// 使用 Promise 来确保命令按顺序执行
			try {
				// 修改打开工程的命令
				await new Promise((resolve, reject) => {
					exec(`${cliCommand} "${workspacePath}"`, (error, stdout, stderr) => {
						if (error) {
							reject(error);
							return;
						}
						// 等待一小段时间确保工程已经打开
						setTimeout(resolve, 3000);
					});
				});

				// 修改打开文件的命令
				await new Promise((resolve, reject) => {
					const openFileCommand = `${cliCommand} --goto "${filePath}:${line}:${column}"`;
					exec(openFileCommand, (error, stdout, stderr) => {
						if (error) {
							reject(error);
							return;
						}
						resolve(stdout);
					});
				});

				vscode.window.showInformationMessage(
					`已在${cliCommand}中打开位置: ${filePath}:${line}:${column}`
				);
			} catch (error) {
				const errorMessage = error instanceof Error
					? error.message
					: '未知错误';
				vscode.window.showErrorMessage(`执行命令失败: ${errorMessage}`);
			}
		}
	);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
