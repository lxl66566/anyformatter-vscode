import * as vscode from "vscode";
const configurationKey = "anyformatter";

export type FormatterConfig = {
	command: string;
};

export type LanguageConfigs = Record<string, FormatterConfig>;

export const getAllConfig: () => vscode.WorkspaceConfiguration = () => {
	return vscode.workspace.getConfiguration(configurationKey);
};

export const getLanguageConfig: (
	language: string,
) => FormatterConfig | undefined = (language: string) =>
	getAllConfig().get(language);

export const getKeys: () => Promise<string[]> = async () => {
	const supportedLanguages = await vscode.languages.getLanguages();
	return Object.keys(getAllConfig()).filter((key) =>
		supportedLanguages.includes(key),
	);
};

export const logAllConfig = (log: vscode.OutputChannel) => {
	log.appendLine("Languages Configuration:");
	log.appendLine(`\t${JSON.stringify(getAllConfig())}`);
};
