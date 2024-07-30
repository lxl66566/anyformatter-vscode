import * as vscode from "vscode";

const configurationKey = "anyformatter";
const languagesConfigurationKey = `${configurationKey}.languages`;

export type FormatterConfig = {
	command: string;
};

export type LanguageConfigs = Record<string, FormatterConfig>;

const getConfig: <ConfigType>(key: string) => ConfigType | undefined = <
	ConfigType,
>(
	key: string,
) => vscode.workspace.getConfiguration().get<ConfigType>(key);

export const getLanguagesConfig: () => LanguageConfigs | undefined = () => {
	return getConfig<LanguageConfigs>(languagesConfigurationKey);
};

export const logLanguagesConfig = (log: vscode.OutputChannel) => {
	log.appendLine("Languages Configuration:");
	log.appendLine(`\t${JSON.stringify(getLanguagesConfig())}`);
};
