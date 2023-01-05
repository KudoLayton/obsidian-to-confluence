import ConfluencePluginSettings from './global'
import {ChildProcess, spawn} from 'child_process'
import {requestUrl, RequestUrlResponsePromise, Vault, FileSystemAdapter} from 'obsidian' 
import {request} from './request'

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
}
