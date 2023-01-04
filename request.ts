import {spawn, ChildProcess} from 'child_process'
export interface RequestParam {
  method: string
  uri: string
  token: string
  body?: string,
  attach?: string
}

export function request(param: RequestParam, pluginPath: string): Promise<string> {
  return new Promise<string>((resolve, reject)=>{
    let requestScriptPath = "";
    let requestProcess: ChildProcess;
    let requestOption: string[] = [];
    if (process.platform == 'win32'){
      requestScriptPath = `${pluginPath}/request.ps1`
      //requestOption = ["-command", requestScriptPath, "GET", "https://wiki.krafton.com/rest/api/content/1790609292?expand=body.storage", "OTI4NTExNTEyMjM1Or8P2bclOXu8HbYijQAotkGHhoSA"];
      requestOption = ["-command", requestScriptPath, param.method, param.uri, param.token];
      if (param.body !== undefined){
        requestOption.concat([param.body]);
      }
      requestProcess = spawn("PowerShell.exe", requestOption);
    } else {
      requestScriptPath = `${pluginPath}/request.sh`
      requestProcess = spawn(requestScriptPath, requestOption);
    }
    let result = "";
    let error = "";
    requestProcess.stdout?.on('data', (data) => result += data);
    requestProcess.stderr?.on('data', (data) => error += data);
    requestProcess.on('error', (err)=> reject(err));
    requestProcess.on('close', (code)=>{
      if (code === 0){
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
}

