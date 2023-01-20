import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import ConfluencePlugin from './main';

export default class ConfluencePluginSettingTab extends PluginSettingTab {
	plugin: ConfluencePlugin;

	constructor(app: App, plugin: ConfluencePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h1', { text: 'Obsidian to Confluence Settings' });

		new Setting(containerEl)
			.setName('Confluence Personal Access Token')
			.setDesc('')
			.addText((text) =>
				text
					.setPlaceholder('Enter Token')
					.setValue(this.plugin.settings.ConfToken)
					.onChange(async (value) => {
						console.log('Saved Token');
						this.plugin.settings.ConfToken = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Confluence Host URL')
			.setDesc('')
			.addText((text) =>
				text
					.setPlaceholder('Enter URL')
					.setValue(this.plugin.settings.ConfURL)
					.onChange(async (value) => {
						console.log('Saved URL');
						this.plugin.settings.ConfURL = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Pandoc Path')
			.setDesc('')
			.addText((text) =>
				text
					.setPlaceholder('Enter Pandoc Path')
					.setValue(this.plugin.settings.PandocPath)
					.onChange(async (value) => {
						console.log('Saved Pandoc Path');
						this.plugin.settings.PandocPath = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Default Wiki Space')
			.setDesc('')
			.addText((text) =>
				text
					.setPlaceholder('Enter Space Name')
					.setValue(this.plugin.settings.defaultSpace)
					.onChange(async (value) => {
						console.log('Saved Spaced Name');
						this.plugin.settings.defaultSpace = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Default Parent Document ID')
			.setDesc('')
			.addText((text) =>
				text
					.setPlaceholder('Enter ID')
					.setValue(
						this.plugin.settings.defaultParentDocumentID.toString(),
					)
					.onChange(async (value) => {
						let numberValue = parseInt(value);
						if (!isNaN(numberValue)) {
							console.log('Saved Default Parent Document ID!');
							this.plugin.settings.defaultParentDocumentID =
								numberValue;
							await this.plugin.saveSettings();
						} else {
							new Notice('Please input numbers only!');
						}
					}),
			);
	}
}
