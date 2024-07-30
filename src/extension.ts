import * as vscode from "vscode";
import * as cp from "child_process";
import * as config from "./configuration";

const haskellLangId = "haskell";

export function activate(context: vscode.ExtensionContext) {
	// Create output channel
	const log = vscode.window.createOutputChannel("anyformatter");
	config.logLanguagesConfig(log);

	// vscode.languages.registerDocumentRangeFormattingEditProvider(haskellLangId, {
	// 	provideDocumentRangeFormattingEdits(document, range, options, token) {
	// 		const text = document.getText(range);
	// 		try {
	// 			const config = vscode.workspace.getConfiguration("anyformatter");
	// 			const args = config.args.join(" ");
	// 			let cmd = config.path;
	// 			if (config.args.length > 0) {
	// 				cmd = `${config.path} ${args}`;
	// 			}
	// 			log.appendLine(`Calling: ${cmd}`);
	// 			const anyformatter = cp.execSync(cmd, {
	// 				input: text,
	// 				cwd: vscode.workspace.getWorkspaceFolder(document.uri).uri.path,
	// 			});
	// 			const formattedText = anyformatter.toString();
	// 			return [vscode.TextEdit.replace(range, formattedText)];
	// 		} catch (e) {
	// 			log.appendLine(e.stderr.toString());
	// 			if (
	// 				vscode.workspace
	// 					.getConfiguration("anyformatter")
	// 					.get("notifyOnParseError")
	// 			) {
	// 				vscode.window.showErrorMessage(
	// 					` anyformatter failed to format the code. ${e.stderr.toString()}`,
	// 				);
	// 			}
	// 		}
	// 	},
	// });
}
