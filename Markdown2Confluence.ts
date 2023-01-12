import Pandoc, {PandocRequest} from './pandoc'
import assert from 'assert'
import { FileSystemAdapter, TFile } from 'obsidian'
import {Doc, mimeModes} from 'codemirror'

export default class Markdown2Confluence {
    pandoc: Pandoc;
    mediaPath: string;
    fileAdapter: FileSystemAdapter;

    constructor(pandocPath: string, mediaPath: string, fileAdapter: FileSystemAdapter){
        this.pandoc = new Pandoc(pandocPath);
        this.mediaPath = mediaPath;
        this.fileAdapter = fileAdapter;
    }

    preprocessExceptCode(source: string, functionList: ((a: string)=>string)[]): string {
      const codeRegex = /(```|`).*?\1/s;
      const matchResult = codeRegex.exec(source);

      let preCode = "";
      let code = "";
      let postCode = "";

      if(matchResult !== null){
        code = matchResult.first() ?? "";
        const matchIndex = matchResult.index;
        assert(typeof matchIndex === "number", "Code block index is not number!");
        preCode = source.slice(0, matchIndex);
        postCode = this.preprocessExceptCode(source.slice(matchIndex + code.length, source.length), functionList);
      } else {
        preCode= source;
      }

      for(const index in functionList){
        preCode = functionList[index](preCode);
      }

      return preCode + code + postCode;
    }

    embedLinkFormatTransform(source: string): string {
      const embedLinkRegex = /\[\[(.*?)\]\]/g;
      const substitutionRegex = "[]($1)"
      return source.replace(embedLinkRegex, substitutionRegex);
    }

    attachmentAnalysis(source: string): string {
      const attachmentNormalizeRegex = /!\[(.*?)\]\(.*?\/([^\/]*)\)/g;
      const replaceRegex = '[$1]($2)';
      return source.replace(attachmentNormalizeRegex, replaceRegex);
    }

    async translateFile(filePath: string): Promise<string> {
        const request = new PandocRequest('markdown', 'jira', filePath);
        return this.pandoc.executePandoc(request);
    }

    async translateStdin(source: string): Promise<string> {
        const request = new PandocRequest('markdown', 'jira', undefined, source);
        return this.pandoc.executePandocStdin(request);
    }

    async fullTranslate(source: string): Promise<string> {
      const preprocessingFunction = [
        this.embedLinkFormatTransform, 
        this.attachmentAnalysis]
      const preprocessedData = this.preprocessExceptCode(source, preprocessingFunction);
      const request = new PandocRequest('markdown', 'jira', undefined, preprocessedData);
      return this.pandoc.executePandocStdin(request);
    }
}
