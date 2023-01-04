import ConfluencePluginSettings from './global'
import {ChildProcess, spawn} from 'child_process'
import {requestUrl, RequestUrlResponsePromise, Vault, FileSystemAdapter} from 'obsidian' 
import {request} from './request'

export default class Confluence {
    pluginPath: string
    setting: ConfluencePluginSettings
    constructor(vault: Vault, setting: ConfluencePluginSettings){
        this.setting = setting;

        const adapter = vault.adapter;
        if(adapter instanceof FileSystemAdapter){
            this.pluginPath = adapter.getFullPath(vault.configDir + '/plugins/obsidian-to-confluence')
        } else {
            this.pluginPath = "";
        }
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
          }, this.pluginPath).then((respond)=>resolve(respond), (err)=>reject(err));
      });
  }

  requestConvertConfWiki2Storage(source: string):Promise<string>{
      return this.requestPostJsonConfluence("rest/api/contentbody/convert/storage", {
          value: source,
          representation: "wiki"
      })
  }
}
