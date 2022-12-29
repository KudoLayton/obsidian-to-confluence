export class Command {
    command: string;
    option: string[];

    constructor(command: string, option: string[]){
        this.command = command;
        this.option = option;
    }
}

export default class CommandBuilder {
    async buildCommand(request: Request): Promise<Command>{
        switch (process.platform){
            case 'win32':
                return await this.buildWindowsCommand(request);
            default:
                return await this.buildUnixCommand(request);
        }
    }

    async buildUnixCommand(request: Request): Promise<Command>{
        let option: string[] = [];
        option.push('-X')
        option.push(request.method);
        option.push(request.url);
        request.headers.forEach((value: string, key: string, _: Headers) => {
            option.push('-H');
            option.push(`${key}: ${value}`);
        });
        
        if(request.bodyUsed){
            option.push('-d');
            let data = await request.text();
            option.push(data);
        }

        return new Command('curl', option);
    }

    async buildWindowsCommand(request: Request): Promise<Command>{
        return new Command('', []);
    }
}
