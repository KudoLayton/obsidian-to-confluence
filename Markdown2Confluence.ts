import Pandoc, {PandocRequest} from './pandoc'

export default class Markdown2Confluence {
    pandoc: Pandoc;

    constructor(pandocPath: string){
        this.pandoc = new Pandoc(pandocPath);
    }

    async translate(filePath: string): Promise<string>{
        let request = new PandocRequest('markdown', 'jira', filePath);
        return this.pandoc.executePandoc(request);
    }
}
