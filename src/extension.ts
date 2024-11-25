// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { exec } from "child_process";

// 定义编辑器配置类型
interface EditorConfig {
	command: string;
	openProjectArgs?: string[];
	openFileArgs?: string[];
}

// 编辑器配置映射
const EDITOR_CONFIGS: Record<string, EditorConfig> = {
	code: {
		command: 'code',
		openFileArgs: ['--goto']
	},
	cursor: {
		command: 'cursor',
		openFileArgs: ['--goto']
	},
	windsur: {
		command: 'windsur',
		openFileArgs: ['--goto']
	},
	webstorm: {
		command: 'webstorm',
		openProjectArgs: ['--line', '--column'],
		openFileArgs: [] // WebStorm 使用不同的参数格式
	}
};

// 修改 openInEditor 函数以支持不同的参数格式
async function openInEditor(editorType: keyof typeof EDITOR_CONFIGS) {
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

	let workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
	if (!workspaceFolder) {
		vscode.window.showErrorMessage("无法获取工作区目录！");
		return;
	}

	const workspacePath = workspaceFolder.uri.fsPath;
	const config = EDITOR_CONFIGS[editorType];

	try {
		// 先打开工程
		await new Promise((resolve, reject) => {
			let command: string;

			if (editorType === 'webstorm') {
				// WebStorm 需要先打开项目
				command = `${config.command} "${workspacePath}"`;
			} else {
				command = `${config.command} "${workspacePath}"`;
			}

			exec(command, (error) => {
				if (error) {
					reject(error);
					return;
				}
				setTimeout(resolve, 3000);
			});
			vscode.window.showInformationMessage(
				`已在${editorType}打开工作区: ${workspacePath}`
			);
		});

		// 然后打开具体文件和位置
		await new Promise((resolve, reject) => {
			let openFileCommand: string;

			if (editorType === 'webstorm') {
				// WebStorm 需要使用不同的命令格式，并且需要等待项目完全打开
				setTimeout(() => {
					openFileCommand = `${config.command} --line ${line} --column ${column} "${filePath}"`;
					exec(openFileCommand, (error) => {
						if (error) {
							reject(error);
							return;
						}
						resolve(null);
					});
				}, 2000); // 额外等待项目加载
			} else {
				// 其他编辑器使用 --goto 参数
				openFileCommand = `${config.command} ${config.openFileArgs?.join(' ') || ''} "${filePath}:${line}:${column}"`;
				exec(openFileCommand, (error) => {
					if (error) {
						reject(error);
						return;
					}
					resolve(null);
				});
			}
		});

		vscode.window.showInformationMessage(
			`已在${editorType}中打开位置: ${filePath}:${line}:${column}`
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

	// 注册所有命令
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

	const openInWebStorm = vscode.commands.registerCommand(
		"sync-editor.openInWebStorm",
		() => openInEditor("webstorm")
	);

	// 将所有命令添加到订阅列表
	context.subscriptions.push(
		openInVSCode,
		openInCursor,
		openInWindsur,
		openInWebStorm
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
