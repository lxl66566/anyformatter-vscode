import * as vscode from "vscode";
const configurationKey = "anyformatter";

export type LanguageConfig = {
  command: string;
  file?: boolean;
  format_on_save?: boolean;
};

export const getAllConfig: () => vscode.WorkspaceConfiguration = () => {
  return vscode.workspace.getConfiguration(configurationKey);
};

export const loadAllConfig = (log: vscode.OutputChannel) => {
  let cfg = getAllConfig();
  log.appendLine("anyformatter configuration:");
  log.appendLine(`\t${JSON.stringify(cfg)}`);
  return cfg;
};
