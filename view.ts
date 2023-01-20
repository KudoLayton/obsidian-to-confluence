import { WorkspaceLeaf, ItemView, Notice } from 'obsidian';
import CodeMirror from 'codemirror';
import Confluence from './confluence';
import ConfluencePluginSettings from './global';

export const VIEW_TYPE_CONF_WIKI = 'confluence-wiki';

export default class ConfluenceWikiView extends ItemView {
	codeMirror: CodeMirror.Editor;
	settings: ConfluencePluginSettings;
	title: string;
	space: string;
	parentID: number;
	attachments: string[];

	constructor(
		leaf: WorkspaceLeaf,
		settings: ConfluencePluginSettings,
		title: string,
		space: string,
		parentID: number,
		data: string,
		attachments: string[],
	) {
		super(leaf);
		leaf.open(this);

		this.settings = settings;
		this.title = title;
		this.space = space;
		this.parentID = parentID;
		this.attachments = attachments;

		const button = this.contentEl.createEl('button', {
			text: 'Create page from parent',
		});
		this.contentEl.createEl('h2', { text: 'Attachments' });
		this.contentEl.createEl('ul', undefined, (el) => {
			for (const idx in attachments) {
				el.createEl('li', { text: attachments[idx] });
			}
		});

		console.log(attachments);

		button.onclick = () => {
			const confluence = new Confluence(this.settings);
			console.log(
				`create page - ${this.title} - ${this.space} - ${this.parentID}`,
			);
			confluence
				.requestCreateConfWiki(
					this.getViewData(),
					this.title,
					this.space,
					parentID,
				)
				.then((respond) => {
					new Notice('Successfully create the page!');
					const respondObj = JSON.parse(respond);
					const id = respondObj['id'];
					return confluence.requestAttachFileList(attachments, id);
				})
				.then((_) => {
					new Notice('Successfully upload all attachments');
				});
			button.setText('Update page');
			button.onclick = () => {};
		};
		this.contentEl.createEl('h2', { text: 'Contents' });
		this.codeMirror = CodeMirror(this.contentEl, { theme: 'obsidian' });
		this.codeMirror.setValue(data);
		this.codeMirror.refresh();
	}

	onResize() {
		this.codeMirror.refresh();
	}

	getViewData(): string {
		return this.codeMirror.getValue();
	}

	setViewData(data: string, _: boolean) {
		this.codeMirror.setValue(data);
		this.codeMirror.refresh();
	}

	clear() {
		this.codeMirror.setValue('');
		this.codeMirror.clearHistory();
	}

	getViewType() {
		return VIEW_TYPE_CONF_WIKI;
	}

	getDisplayText(): string {
		return 'Obsidian Wiki (Preview)';
	}
}
