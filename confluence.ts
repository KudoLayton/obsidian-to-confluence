import ConfluencePluginSettings from './global'
import CommandBuilder, {Command, CommandRequest} from './commandBuilder'
import {ChildProcess, spawn} from 'child_process'

export default class Confluence {
  async requestGetConfluence(setting: ConfluencePluginSettings, urlCommand: string): Promise<string> {
    let url = new URL(urlCommand, setting.ConfURL);
    let headers = new Headers();
    headers.set("Authorization", `Bearer ${setting.ConfToken}`);
    let request = new CommandRequest(url, 'GET', headers, "");
    console.log(request);

    let builder = new CommandBuilder();
    let command = builder.buildCommand(request);
    let result = '';
    let err = '';
    return new Promise<string>(
        (resolve, reject) => {
            let reqProcess = spawn(command.command, command.option);
            reqProcess.stdout!.on('data', (data: any)=> {result += data;});
            reqProcess.stderr!.on('data', (data: any)=> {err += data;});
            reqProcess.on('exit', (code: number)=>{
                if(code == 0){
                    resolve(result);
                } else {
                    reject(new Error(`[cURL Error - ${code}] ${err}`));
                }
            });
        }
    );
  }

  async requestPostConfluence(setting: ConfluencePluginSettings, urlCommand: string): Promise<string> {
    let url = new URL(urlCommand, setting.ConfURL);
    let headers = new Headers();
    headers.set("Authorization", `Bearer ${setting.ConfToken}`);
    let request = new CommandRequest(url, 'POST', headers, "");

    let builder = new CommandBuilder();
    let command = builder.buildCommand(request);
    let result = '';
    let err = '';
    return new Promise<string>(
        (resolve, reject) => {
            console.log(command.option);
            let reqProcess = spawn(command.command, command.option);
            reqProcess.stdout!.on('data', (data: any)=> {result += data;});
            reqProcess.stderr!.on('data', (data: any)=> {err += data;});
            reqProcess.on('exit', (code: number)=>{
                if(code == 0){
                    resolve(result);
                } else {
                    reject(new Error(`[cURL Error - ${code}] ${err}`));
                }
            });
        }
    );
  }

  async requestPostJSONConfluence(setting: ConfluencePluginSettings, urlCommand: string, body: string): Promise<string> {
    let url = new URL(urlCommand, setting.ConfURL);
    let headers = new Headers();
    headers.set("Authorization", `Bearer ${setting.ConfToken}`);
    headers.set("Content-Type", "application/json");
    let request = new CommandRequest(url, 'POST', headers, body);

    let builder = new CommandBuilder();
    let command = builder.buildCommand(request);
    let result = '';
    let err = '';
    return new Promise<string>(
        (resolve, reject) => {
            console.log(command.option);
            let reqProcess = spawn(command.command, command.option);
            reqProcess.stdout!.on('data', (data: any)=> {result += data;});
            reqProcess.stderr!.on('data', (data: any)=> {err += data;});
            reqProcess.on('exit', (code: number)=>{
                if(code == 0){
                    resolve(result);
                } else {
                    reject(new Error(`[cURL Error - ${code}] ${err}`));
                }
            });
        }
    );
  }
}
