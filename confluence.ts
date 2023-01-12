import ConfluencePluginSettings from './global'
import {ChildProcess, spawn} from 'child_process'
import {requestUrl, RequestUrlResponsePromise, Vault, FileSystemAdapter} from 'obsidian' 
import {request} from './request'
import assert from 'assert'

export default class Confluence {
    setting: ConfluencePluginSettings
    constructor(setting: ConfluencePluginSettings){
        this.setting = setting;
    }

  requestGetConfluence(urlCommand: string): RequestUrlResponsePromise {
    return requestUrl({
        url: this.setting.ConfURL+urlCommand,
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${this.setting.ConfToken}`
        }
    });
  }

  requestPostJsonConfluence(urlCommand: string, data: any): Promise<string> {
      return new Promise<string>((resolve, reject)=>{
          request({
              method: 'POST',
              uri: this.setting.ConfURL + urlCommand,
              token: this.setting.ConfToken,
              body: JSON.stringify(data)
          }).then((respond)=>resolve(respond), (err)=>reject(err));
      });
  }

  requestPostFormConfluence(urlCommand: string, forms_data: Record<string, string>, extra_headers: Record<string, string>): Promise<string> {
    return new Promise<string>((resolve, reject) => request({
      uri: this.setting.ConfURL + urlCommand,
      method: "POST",
      token: this.setting.ConfToken,
      forms: forms_data,
      headers: extra_headers
    }).then((respond)=>console.log(respond)));
  }

  requestConvertConfWiki2Storage(source: string):Promise<string>{
      return this.requestPostJsonConfluence("rest/api/contentbody/convert/storage", {
          value: source,
          representation: "wiki"
      })
  }

  requestCreateConfWiki(source: string, title: string, space: string, parentID: number): Promise<string>{
    return this.requestPostJsonConfluence("rest/api/content", {
      type: "page",
      title: title,
      ancestors: [{"id": parentID}],
      space: {"key": space},
      body: { 
        storage: {
          value: source,
          representation: "wiki"
        }
      }
    });
  }

  requestAttachFile(filePath: string, pageID: number): Promise<string>{
    return this.requestPostFormConfluence(`rest/api/content/${pageID}/child/attachment`, {
      "file": `@${filePath}`
    }, {
      "X-Atlassian-Token": "no-check"
    });
  }

  async requestAttachFileList(filePathList: string[], pageID: number): Promise<string[]>{
      return new Promise<string[]>((resolve, reject) => {
          async () => {
              let outputList: string[] = [];
              for (const idx in filePathList){
                const output = await this.requestPostFormConfluence(`rest/api/content/${pageID}/child/attachment`, {
                  "file": `@${filePathList[idx]}`
                }, {
                  "X-Atlassian-Token": "no-check"
                });
                outputList = outputList.concat([output]);
              }
              resolve(outputList);
          }
      });
  }
}

/*
async function recursiveRequest (filePathList: string[], pageID: number, conf: Confluence, previousOutput: string[], resolve: any, reject: any): Promise<string[]> {
  const iteratorObj = iterator.next();
  const path = iteratorObj.value[1];
    console.log(path);
    console.log(iteratorObj);
    console.log(iteratorObj.done);
  assert(typeof path === "string");
  const test = false;
  if (test){
      conf.requestAttachFile(path, pageID).then((value) => {
        previousOutput = previousOutput.concat([value]);
          resolve(previousOutput);
      }, reject);
  } else {
      conf.requestAttachFile(path, pageID).then((value) => {
        previousOutput = previousOutput.concat([value]);
        recursiveRequest(iterator, pageID, conf, previousOutput, resolve, reject);
      }, reject);
  }
}
function old_recursiveRequest (iterator: IterableIterator<[number, string]>, pageID: number, conf: Confluence, previousOutput: string[], resolve: any, reject: any): void {
  const iteratorObj = iterator.next();
  const path = iteratorObj.value[1];
    console.log(path);
    console.log(iteratorObj);
    console.log(iteratorObj.done);
  assert(typeof path === "string");
  const test = false;
  if (test){
      conf.requestAttachFile(path, pageID).then((value) => {
        previousOutput = previousOutput.concat([value]);
          resolve(previousOutput);
      }, reject);
  } else {
      conf.requestAttachFile(path, pageID).then((value) => {
        previousOutput = previousOutput.concat([value]);
        recursiveRequest(iterator, pageID, conf, previousOutput, resolve, reject);
      }, reject);
  }
}
*/

