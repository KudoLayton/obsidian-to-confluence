import { App, Modal, Notice, Plugin, FileSystemAdapter } from 'obsidian';
import ConfluencePluginSettingTab from './settings';
import ConfluencePluginSettings, { DEFAULT_SETTINGS } from './global';
import Markdown2Confluence from './Markdown2Confluence'
import ConfluenceWikiView from './view'

export default class ConfluencePlugin extends Plugin {
	settings: ConfluencePluginSettings;

	async onload() {
		await this.loadSettings();
		const ribbonIconEl = this.addRibbonIcon('file-up', 'Prepare Obsidian to Confluence', (_) => {
            const adapter = this.app.vault.adapter;
            if (adapter instanceof FileSystemAdapter){
              const fileData = this.app.workspace.getActiveFile();
              const md2conf = new Markdown2Confluence(this.settings.PandocPath, fileData?.parent.path ?? "/", adapter);
              const attachmentList: string[] = [];

                if (fileData !== null){
                    const attachments = this.app.metadataCache.resolvedLinks[fileData.path];
                    for(const attachmentPath in attachments){
                        if (!attachmentPath.toLocaleLowerCase().endsWith(".md")){
                             attachmentList.push(adapter.getFullPath(attachmentPath));
                        }
                    }

                    try {
                      md2conf.fullTranslate(this.app.workspace.activeEditor?.editor?.getValue() ?? "", attachmentList).then((transResult)=>{
                        new ConfluenceWikiView(this.app.workspace.getLeaf("split", "vertical"), this.settings, fileData?.basename ?? "noname", this.settings.defaultSpace, this.settings.defaultParentDocumentID, transResult, attachmentList);
                      });
                    } catch (e){
                        new Notice(e);
                    }
                }
            }
		});

		this.addCommand({
			id: 'prepare-confluence-default',
			name: 'prepare upload confluence (default)',
			callback: () => {
                const adapter = this.app.vault.adapter;
                if (adapter instanceof FileSystemAdapter){
                  const fileData = this.app.workspace.getActiveFile();
                  const md2conf = new Markdown2Confluence(this.settings.PandocPath, fileData?.parent.path ?? "/", adapter);
                  const attachmentList: string[] = [];

                    if (fileData !== null){
                        const attachments = this.app.metadataCache.resolvedLinks[fileData.path];
                        for(const attachmentPath in attachments){
                            if (!attachmentPath.toLocaleLowerCase().endsWith(".md")){
                                 attachmentList.push(adapter.getFullPath(attachmentPath));
                            }
                        }

                        try {
                          md2conf.fullTranslate(this.app.workspace.activeEditor?.editor?.getValue() ?? "", attachmentList).then((transResult)=>{
                            new ConfluenceWikiView(this.app.workspace.getLeaf("split", "vertical"), this.settings, fileData?.basename ?? "noname", this.settings.defaultSpace, this.settings.defaultParentDocumentID, transResult, attachmentList);
                          });
                        } catch (e){
                            new Notice(e);
                        }
                    }
                }
			}
		});

		this.addSettingTab(new ConfluencePluginSettingTab(this.app, this));
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
        const adapter = this.app.vault.adapter;
        if (adapter instanceof FileSystemAdapter){
          const fileData = this.app.workspace.getActiveFile();
          this.md2conf = new Markdown2Confluence(this.setting.PandocPath,fileData?.parent.path ?? "/", adapter);
        }
	}

	onOpen() {
		const {contentEl} = this;
        const fileData = this.app.workspace.getActiveFile();
        const adapter = this.app.vault.adapter;
        const attachmentList: string[] = [];
        if(adapter instanceof FileSystemAdapter){
            if (fileData !== null){
                const attachments = this.app.metadataCache.resolvedLinks[fileData.path];
                for(const attachmentPath in attachments){
                    if (!attachmentPath.toLocaleLowerCase().endsWith(".md")){
                         attachmentList.push(adapter.getFullPath(attachmentPath));
                    }
                }
            }

            try {
              this.md2conf.fullTranslate(this.app.workspace.activeEditor?.editor?.getValue() ?? "", attachmentList).then((transResult)=>{
                new ConfluenceWikiView(this.app.workspace.getLeaf("split", "vertical"), this.setting, fileData?.basename ?? "noname", this.setting.defaultSpace, this.setting.defaultParentDocumentID, transResult, attachmentList);
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

