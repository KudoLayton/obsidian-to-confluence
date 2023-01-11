import Pandoc, {PandocRequest} from './pandoc'
import assert from 'assert'
import { FileSystemAdapter, TFile } from 'obsidian'
import {Doc, mimeModes} from 'codemirror'

export class DocumentData {
  pageContent: string
  attachments: string[]

  constructor(pageContent:string, attachments: string[]){
    this.pageContent = pageContent;
    this.attachments = attachments;
  }
}

export default class Markdown2Confluence {
    pandoc: Pandoc;
    mediaPath: string;
    fileAdapter: FileSystemAdapter;

    constructor(pandocPath: string, mediaPath: string, fileAdapter: FileSystemAdapter){
        this.pandoc = new Pandoc(pandocPath);
        this.mediaPath = mediaPath;
        this.fileAdapter = fileAdapter;
    }

    preprocessExceptCode(source: string, functionList: ((a: DocumentData)=>DocumentData)[]): DocumentData {
      let codeRegex = /(```|`).*?\1/s;
      let matchResult = codeRegex.exec(source);

      let preCode = "";
      let code = "";
      let postCode = "";
      let attachments: string[] = [];

      if(matchResult !== null){
        code = matchResult.first() ?? "";
        let matchIndex = matchResult.index;
        assert(typeof matchIndex === "number", "Code block index is not number!");
        preCode = source.slice(0, matchIndex);
        let postDocument = this.preprocessExceptCode(source.slice(matchIndex + code.length, source.length), functionList);
        postCode = postDocument.pageContent;
        attachments = postDocument.attachments;
      } else {
        preCode= source;
      }

      for(let index in functionList){
        let preDocument = functionList[index](new DocumentData(preCode, []));
        preCode = preDocument.pageContent;
        attachments = preDocument.attachments.concat(attachments);
      }

      return new DocumentData(preCode + code + postCode, attachments);
    }

    embedLinkFormatTransform(source: string): string {
      let embedLinkRegex = /\[\[(.*?)\]\]/g;
      let substitutionRegex = "[]($1)"
      return source.replace(embedLinkRegex, substitutionRegex);
    }

    attachmentAnalysis(source: string): DocumentData {
      let attachmentRegex = /\!\[.*?\]\((.*?)\)/g;
      let regexResult: RegExpExecArray | null = null;
      let attachments: string[] = [];
      console.log(`[attachmentAnalysis-source]\n${source}`);
      while((regexResult = attachmentRegex.exec(source)) !== null) {
        if (regexResult.index === attachmentRegex.lastIndex) {
          ++attachmentRegex.lastIndex;
        }
        console.log(`[attachmentAnalysis-attachment] ${regexResult[1]}`)
        attachments.concat([this.fileAdapter.getFullPath(`${this.mediaPath}+${regexResult[1]}`)]);
      }

      let attachmentNormalizeRegex = /\!\[(.*?)\]\(.*?\/([^\/]*)\)/g;
      let replaceRegex = '[$1]($2)';
      let resultString = source.replace(attachmentNormalizeRegex, replaceRegex);
      return new DocumentData(resultString, attachments);
    }

    async translateFile(filePath: string): Promise<string> {
        let request = new PandocRequest('markdown', 'jira', filePath);
        return this.pandoc.executePandoc(request);
    }

    async translateStdin(source: string): Promise<string> {
        let request = new PandocRequest('markdown', 'jira', undefined, source);
        return this.pandoc.executePandocStdin(request);
    }

    async fullTranslate(source: string): Promise<DocumentData> {
      let preprocessingFunction = [
        (doc: DocumentData) => new DocumentData(this.embedLinkFormatTransform(doc.pageContent), doc.attachments), 
        (doc: DocumentData) => this.attachmentAnalysis(doc.pageContent)]
      let preprocessedData = this.preprocessExceptCode(source, preprocessingFunction);
      let request = new PandocRequest('markdown', 'jira', undefined, preprocessedData.pageContent);
      return new Promise<DocumentData>((resolve, reject) => {
        this.pandoc.executePandocStdin(request).then((value) => resolve(new DocumentData(value, preprocessedData.attachments)), reject);
      });
    }
}
