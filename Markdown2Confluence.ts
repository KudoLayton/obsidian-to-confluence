import Pandoc, {PandocRequest} from './pandoc'
import assert from 'assert'

export default class Markdown2Confluence {
    pandoc: Pandoc;

    constructor(pandocPath: string){
        this.pandoc = new Pandoc(pandocPath);
    }

    preprocessExceptCode(source: string, functionList: ((a: string)=>string)[]): string {
      let codeRegex = /(```|`).*?\1/s;
      let matchResult = codeRegex.exec(source);

      let preCode = "";
      let code = "";
      let postCode = "";

      if(matchResult !== null){
        code = matchResult.first() ?? "";
        let matchIndex = matchResult.index;
        assert(typeof matchIndex === "number", "Code block index is not number!");
        preCode = source.slice(0, matchIndex);
        postCode = this.preprocessExceptCode(source.slice(matchIndex + code.length, source.length), functionList);
      } else {
        preCode= source;
      }

      for(let index in functionList){
        preCode = functionList[index](preCode);
      }

      return preCode + code + postCode;
    }

    embedLinkFormatTransform(source: string): string {
      let embedLinkRegex = /\[\[(.*?)\]\]/g;
      let substitutionRegex = "\(\)\[$1\]"
      return source.replace(embedLinkRegex, substitutionRegex);
    }

    async translate(filePath: string): Promise<string>{
        let request = new PandocRequest('markdown', 'jira', filePath);
        return this.pandoc.executePandoc(request);
    }
}
