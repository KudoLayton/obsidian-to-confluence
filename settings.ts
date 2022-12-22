import {App, PluginSettingTab, Setting} from 'obsidian';
import ConfluencePlugin from './main';

export default class ConfluencePluginSettingTab extends PluginSettingTab {
	plugin: ConfluencePlugin;

	constructor(app: App, plugin: ConfluencePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h1', {text: 'Obsidian to Confluence Settings'});

		new Setting(containerEl)
			.setName('Confluence Personal Access Token')
			.setDesc('')
			.addText(text => text
				.setPlaceholder('Enter Token')
				.setValue(this.plugin.settings.ConfToken)
				.onChange(async (value) => {
					console.log('Saved Token');
					this.plugin.settings.ConfToken = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Confluence Host URL')
			.setDesc('')
			.addText(text => text
				.setPlaceholder('Enter URL')
				.setValue(this.plugin.settings.ConfURL)
				.onChange(async (value) => {
					console.log('Sved URL');
					this.plugin.settings.ConfURL = value;
					await this.plugin.saveSettings();
				}));
	}
}
