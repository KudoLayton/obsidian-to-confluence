import {WorkspaceLeaf, ItemView} from 'obsidian'
import CodeMirror from 'codemirror'
import Confluence from './confluence'
import ConfluencePluginSettings from './global';

export const VIEW_TYPE_CONF_WIKI = "confluence-wiki";

export default class ConfluenceWikiView extends ItemView {
  codeMirror: CodeMirror.Editor;
  settings: ConfluencePluginSettings;
  title: string;
  space: string;
  parentID: number;

  constructor(leaf: WorkspaceLeaf, settings: ConfluencePluginSettings, title: string, space: string, parentID: number){
    super(leaf);
    leaf.open(this);

    this.settings = settings;
    this.title = title;
    this.space = space;
    this.parentID = parentID;

    let button = this.contentEl.createEl('button', {text: "Create page from parent"});
    button.onclick = () => { 
      let confluence = new Confluence(this.settings);
      console.log(`create page - ${this.title} - ${this.space} - ${this.parentID}`);
      confluence.requestCreateConfWiki(this.getViewData(), this.title, this.space, parentID).then((respond) => {console.log(respond)});
      button.setText("Update page");
      button.onclick = () => {}
    }
    this.codeMirror = CodeMirror(this.contentEl, { theme: "obsidian" });
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
    this.codeMirror.setValue("");
    this.codeMirror.clearHistory();
  }

  getViewType() {
    return VIEW_TYPE_CONF_WIKI;
  }

  getDisplayText(): string {
    return "Obsidian Wiki (Preview)";
  }
}

