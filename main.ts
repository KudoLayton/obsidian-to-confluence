import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, RequestUrlParam, request, requestUrl, FileSystemAdapter, TextFileView, WorkspaceLeaf } from 'obsidian';
import ConfluencePluginSettingTab from './settings';
import ConfluencePluginSettings, { DEFAULT_SETTINGS } from './global';
import {spawn} from 'child_process'
import Confluence from './confluence'
import Markdown2Confluence from './Markdown2Confluence'
import ConfluenceWikiView, {VIEW_TYPE_CONF_WIKI} from './view'

export default class ConfluencePlugin extends Plugin {
	settings: ConfluencePluginSettings;

	async onload() {
		await this.loadSettings();
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app, this.settings).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app, this.settings).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ConfluencePluginSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
    this.registerView(VIEW_TYPE_CONF_WIKI, (leaf: WorkspaceLeaf) => new ConfluenceWikiView(leaf));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
  setting: ConfluencePluginSettings;
  md2conf: Markdown2Confluence;

	constructor(app: App, setting: ConfluencePluginSettings) {
		super(app);
        this.setting = setting;
        this.md2conf = new Markdown2Confluence(this.setting.PandocPath);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');

        const fileData = this.app.workspace.getActiveFile();
        const adapter = this.app.vault.adapter;
        if(adapter instanceof FileSystemAdapter){
            try {
              this.md2conf.translate(adapter.getFullPath(fileData!.path)).then((transResult)=>{
                console.log(transResult);
                let wikiView = new ConfluenceWikiView(this.app.workspace.getLeaf("split", "vertical"));
                wikiView.setViewData(transResult, true);
              });
            } catch (e){
                new Notice(e);
            }
        }
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

