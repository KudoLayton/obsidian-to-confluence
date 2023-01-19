import Pandoc, {PandocRequest} from './pandoc'
import assert from 'assert'
import { FileSystemAdapter, } from 'obsidian'
import {platform} from 'os';

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

    postprocessExceptCode(source: string, functionList: ((a: string)=>string)[]): string {
      const codeRegex = /\{code(?::.*?)\}.*?\{code\}/gs;
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

    attachmentSpaceCharacter(source: string, attachments: string[]): string{
      const fileNames: [string, string][] = [];
      for (const path of attachments){
        if(platform() === 'win32'){
          const splitIdx = path.lastIndexOf('\\');
          const originName = path.slice(splitIdx + 1);
          fileNames.push([originName, originName.replace(/ /g, "%20")]);
        } else {
          const splitIdx = path.lastIndexOf('/');
          const originName = path.slice(splitIdx + 1);
          fileNames.push([originName, originName.replace(/ /g, "%20")]);
        }
      }

      let result = source;
      for (const name of fileNames){
        let oldResult = ""
        do{
            oldResult = result;
            result = result.replace(name[1], name[0]);
        }while(oldResult !== result);
      }
      return result;
    }

    async translateFile(filePath: string): Promise<string> {
        const request = new PandocRequest('markdown', 'jira', filePath);
        return this.pandoc.executePandoc(request);
    }

    async translateStdin(source: string): Promise<string> {
        const request = new PandocRequest('markdown', 'jira', undefined, source);
        return this.pandoc.executePandocStdin(request);
    }

    async fullTranslate(source: string, attachments: string[]): Promise<string> {
      const preprocess = [
        this.embedLinkFormatTransform, 
        this.attachmentAnalysis]
      const preprocessedData = this.preprocessExceptCode(source, preprocess);
      const postProcess = [
        (value: string) => this.attachmentSpaceCharacter(value, attachments)
      ]
      const request = new PandocRequest('markdown', 'jira', undefined, preprocessedData);
      return this.pandoc.executePandocStdin(request).then((value) => this.postprocessExceptCode(value, postProcess));
    }
}
