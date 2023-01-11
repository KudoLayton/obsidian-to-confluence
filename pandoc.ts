import {lookpath} from 'lookpath'
import {ChildProcess, spawn} from 'child_process'
import assert from 'assert'
import types from 'util/types'

export class PandocRequest {
    from: string;
    to: string;
    filePath?: string;
    data?: string

    constructor(from: string, to: string, filePath?: string, data?: string){
        this.from = from;
        this.to = to;
        this.filePath = filePath;
        this.data = data;
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
        assert(request.filePath !== undefined, "filePath should be not undefined!");
        let option: string[] = [];
        option.push('--from')
        option.push(request.from);
        option.push('--to');
        option.push(request.to);
        option.push(request.filePath);
        return new Command(this.pandocPath, option);
    }

    buildPandocStdinCommand(request: PandocRequest): Command{
        assert(request.data !== undefined, "data should be not undefined!");
        let option: string[] = [];
        option.push('--from')
        option.push(request.from);
        option.push('--to');
        option.push(request.to);
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

    async executePandocStdin(request: PandocRequest): Promise<string> {
        let command = this.buildPandocStdinCommand(request);
        return new Promise<string>(
            (resolve, reject) => {
                lookpath(this.pandocPath).then((path)=>{
                    if(path === undefined){
                        throw "Pandoc not found!";
                    } else {
                        assert(request.data !== undefined, "request data should be not undefined!");
                        let pandocProcess = spawn(command.command, command.option);
                        pandocProcess.stdin.write(request.data, (error) => {
                          if (types.isNativeError(error)){
                            reject(error);
                          } else {
                            pandocProcess.stdin.end();
                          }
                        });
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

