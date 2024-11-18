import * as vscode from "vscode";
import * as cp from "node:child_process";
import * as config from "./configuration";

export async function activate(context: vscode.ExtensionContext) {
  // Create output channel
  const log = vscode.window.createOutputChannel("anyformatter");
  const cfg = config.loadAllConfig(log);
  for (const [language, setting] of Object.entries(cfg) as [string, config.LanguageConfig][]) {
    if (["has", "get", "update", "inspect"].includes(language)) continue;
    log.appendLine(`Registering language: ${language}`);

    // stdin and stdout format
    if (!setting.file) {
      log.appendLine(`Register type: stdin/stdout`);
      const rangeformat = vscode.languages.registerDocumentRangeFormattingEditProvider(language, {
        provideDocumentRangeFormattingEdits(document, range, _options, _token) {
          const text = document.getText(range);
          try {
            const cmd = setting.command;
            if (!cmd) {
              const errorMessage = `No command found for language: ${language}`;
              log.appendLine(errorMessage);
              vscode.window.showErrorMessage(errorMessage);
              return;
            }
            log.appendLine(`Calling: ${cmd}, stdin: ${text}`);
            const anyformatter = cp.execSync(cmd, {
              input: text,
              cwd: vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath,
            });
            const formattedText = anyformatter.toString();
            return [vscode.TextEdit.replace(range, formattedText)];
          } catch (e) {
            const error = e as cp.ExecException;
            log.appendLine(`Error: ${error.message}`);
            vscode.window.showErrorMessage(`anyformatter failed to format the code: ${error.message}`);
            if (error.stderr) {
              log.appendLine(`Stderr: ${error.stderr}`);
            }
          }
        },
      });
      context.subscriptions.push(rangeformat);
    } // file without format_on_save
    else if (!setting.format_on_save) {
      log.appendLine(`Register type: file`);
      const fileformat = vscode.languages.registerDocumentFormattingEditProvider(language, {
        provideDocumentFormattingEdits(document, _options, _token) {
          const file_path = document.uri.fsPath;
          try {
            let cmd = setting.command;
            cmd += ` "${file_path}"`;
            const cwd = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath;
            log.appendLine(`Calling: \`${cmd}\` in \`${cwd}\``);
            const output = cp.execSync(cmd, {
              cwd: cwd,
            });
            log.appendLine(`Stdout: ${output}`);
            return [];
          } catch (e) {
            const error = e as cp.ExecException;
            log.appendLine(`Error: ${error.message}`);
            vscode.window.showErrorMessage(`anyformatter failed to format the code: ${error.message}`);
            if (error.stderr) {
              log.appendLine(`Stderr: ${error.stderr}`);
            }
          }
        },
      });
      context.subscriptions.push(fileformat);
    } // file with format_on_save
    else {
      log.appendLine(`Register type: file with format_on_save`);
      const disposable = vscode.workspace.onDidSaveTextDocument(async (document) => {
        const file_path = document.uri.fsPath;
        if (file_path.split(".").pop() !== language) return;
        let cmd = setting.command;
        cmd += ` "${file_path}"`;
        const cwd = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath;
        try {
          log.appendLine(`Calling: \`${cmd}\` in \`${cwd}\``);
          const output = cp.execSync(cmd, {
            cwd: cwd,
          });
          log.appendLine(`Stdout: ${output}`);
        } catch (e) {
          const error = e as cp.ExecException;
          vscode.window.showErrorMessage(`anyformatter failed to format the code: ${error.message}`);
        }
      });
      context.subscriptions.push(disposable);
    }
  }
}
