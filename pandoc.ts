import {lookpath} from 'lookpath'
import {ChildProcess, spawn} from 'child_process'

export class PandocRequest {
    from: string;
    to: string;
    filePath: string;

    constructor(from: string, to: string, filePath: string){
        this.from = from;
        this.to = to;
        this.filePath = filePath;
    }
}

export class Command {
    command: string;
    option: string[];

    constructor(command: string, option: string[]){
        this.command = command;
        this.option = option;
    }
}

export default class Pandoc {
    pandocPath: string;

    constructor(pandocPath: string){
        this.pandocPath = pandocPath || 'pandoc';
    }

    buildPandocCommand(request: PandocRequest): Command{
        let option: string[] = [];
        option.push('--from')
        option.push(request.from);
        option.push('--to');
        option.push(request.to);
        option.push(request.filePath);
        
        return new Command(this.pandocPath, option);
    }

    async executePandoc(request: PandocRequest): Promise<string> {
        let command = this.buildPandocCommand(request);
        return new Promise<string>(
            (resolve, reject) => {
                lookpath(this.pandocPath).then((path)=>{
                    if(path === undefined){
                        throw "Pandoc not found!";
                    } else {
                        let pandocProcess = spawn(command.command, command.option);
                        let result = "";
                        let error = "";
                        pandocProcess.stdout.on('data', (data: any) => result += data);
                        pandocProcess.stderr.on('data', (data: any) => error += data);
                        pandocProcess.on("error", (err) => reject(err));
                        pandocProcess.on("close", (code)=>{
                            if (code === 0){
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        });
                    }
                })
            }
        );
    }
}

