import {TextFileView, WorkspaceLeaf, ItemView} from 'obsidian'
import CodeMirror from 'codemirror'

export const VIEW_TYPE_CONF_WIKI = "confluence-wiki";

export default class ConfluenceWikiView extends ItemView {
  codeMirror: CodeMirror.Editor;

  constructor(leaf: WorkspaceLeaf){
    super(leaf);
    leaf.open(this);
    this.codeMirror = CodeMirror(this.contentEl, {
            theme: "obsidian",
        });
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

