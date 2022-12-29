export class CommandRequest{
    url: URL;
    method: string;
    headers: Headers;
    body: string;

    constructor(url: URL, method: string, headers: Headers, body: string){
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.body = body;
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

export default class CommandBuilder {
    buildCommand(request: CommandRequest): Command{
        switch (process.platform){
            case 'win32':
                return this.buildWindowsCommand(request);
            default:
                return this.buildUnixCommand(request);
        }
    }

    buildUnixCommand(request: CommandRequest): Command{
        let option: string[] = [];
        option.push('-X')
        option.push(request.method);
        option.push(request.url.href);
        request.headers.forEach((value, key) => {
            option.push('-H');
            option.push(`${key}: ${value}`);
        });
        
        if(request.body.length > 0){
            option.push('-d');
            option.push(request.body);
        }

        return new Command('curl', option);
    }

    buildWindowsCommand(request: CommandRequest): Command{
        return new Command('', []);
    }
}
