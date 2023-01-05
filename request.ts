import {spawn, ChildProcess} from 'child_process'
export interface RequestParam {
  method: string
  uri: string
  token: string
  body?: string,
  attach?: string,
  headers?: Record<string, string>,
  forms?: Record<string, string>
}

export function request(param: RequestParam): Promise<string> {
  return new Promise<string>((resolve, reject)=>{
    let requestProcess: ChildProcess;
    let requestOption = ["-X", param.method, param.uri, "-H",`Authorization: Bearer ${param.token}`];

    if (param.headers !== undefined){
      for (const key in param.headers){
        requestOption = requestOption.concat(["-H", `${key}:${param.headers[key]}`]);
      }
    }

    if (param.body !== undefined){
      requestOption = requestOption.concat(["-H", "Content-Type: application/json", `-d${param.body}`]);
    }

    if (param.forms !== undefined){
      for (const key in param.forms){
        requestOption = requestOption.concat(["-F", `${key}=${param.forms[key]}`]);
      }
    }

    console.log(requestOption);
    requestProcess = spawn("curl", requestOption);
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

