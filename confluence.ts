import ConfluencePluginSettings from './global'

export default class Confluence {
  getRestURL(hostURL: string): URL {
    let output = new URL('/rest/api', hostURL.trim());
    return output;
  }

  async requestGetConfluence(setting: ConfluencePluginSettings, urlCommand: string): Promise<Response> {
    let apiBase: URL = this.getRestURL(setting.ConfURL);
    let url = new URL(urlCommand, apiBase);
    let bearToken = "Bearer " + setting.ConfToken;
    const response: Response = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Authorization': bearToken
      }
    });
    return response;
  }
}
