import ConfluencePluginSettings from './global'
import {ChildProcess, spawn} from 'child_process'
import {requestUrl, RequestUrlResponsePromise} from 'obsidian' 

export default class Confluence {
  requestGetConfluence(setting: ConfluencePluginSettings, urlCommand: string): RequestUrlResponsePromise {
    return requestUrl({
        url: setting.ConfURL+urlCommand,
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${setting.ConfToken}`
        }
    });
  }
}
