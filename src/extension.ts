import * as vscode from "vscode";
import * as cp from "child_process";
import * as config from "./configuration";

export async function activate(context: vscode.ExtensionContext) {
	// Create output channel
	const log = vscode.window.createOutputChannel("anyformatter");
	config.logAllConfig(log);
	const languages = await config.getKeys();
	for (const language of languages) {
		log.appendLine(`Registering language: ${language}`);
		const disposable =
			vscode.languages.registerDocumentRangeFormattingEditProvider(language, {
				provideDocumentRangeFormattingEdits(document, range, options, token) {
					const text = document.getText(range);
					try {
						const cmd = config.getLanguageConfig(language)?.command;
						if (!cmd) {
							const errorMessage = `No command found for language: ${language}`;
							log.appendLine(errorMessage);
							vscode.window.showErrorMessage(errorMessage);
							return;
						}
						log.appendLine(`Calling: ${cmd}, stdin: ${text}`);
						const anyformatter = cp.execSync(cmd, {
							input: text,
							cwd: vscode.workspace.getWorkspaceFolder(document.uri)?.uri
								.fsPath,
						});
						const formattedText = anyformatter.toString();
						return [vscode.TextEdit.replace(range, formattedText)];
					} catch (e) {
						const error = e as cp.ExecException;
						log.appendLine(`Error: ${error.message}`);
						vscode.window.showErrorMessage(
							`anyformatter failed to format the code: ${error.message}`,
						);
						if (error.stderr) {
							log.appendLine(`Stderr: ${error.stderr}`);
						}
					}
				},
			});
		context.subscriptions.push(disposable);
	}
}
