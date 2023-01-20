import ConfluencePluginSettings from './global';
import { requestUrl, RequestUrlResponsePromise } from 'obsidian';
import { request, serialRequest } from './request';

export default class Confluence {
	setting: ConfluencePluginSettings;
	constructor(setting: ConfluencePluginSettings) {
		this.setting = setting;
	}

	requestGetConfluence(urlCommand: string): RequestUrlResponsePromise {
		return requestUrl({
			url: this.setting.ConfURL + urlCommand,
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.setting.ConfToken}`,
			},
		});
	}

	requestPostJsonConfluence(urlCommand: string, data: any): Promise<string> {
		return request({
			method: 'POST',
			uri: this.setting.ConfURL + urlCommand,
			token: this.setting.ConfToken,
			body: JSON.stringify(data),
		});
	}

	requestPostFormConfluence(
		urlCommand: string,
		forms_data: Record<string, string>,
		extra_headers: Record<string, string>,
	): Promise<string> {
		return request({
			uri: this.setting.ConfURL + urlCommand,
			method: 'POST',
			token: this.setting.ConfToken,
			forms: forms_data,
			headers: extra_headers,
		});
	}

	requestConvertConfWiki2Storage(source: string): Promise<string> {
		return this.requestPostJsonConfluence(
			'rest/api/contentbody/convert/storage',
			{
				value: source,
				representation: 'wiki',
			},
		);
	}

	requestCreateConfWiki(
		source: string,
		title: string,
		space: string,
		parentID: number,
	): Promise<string> {
		return this.requestPostJsonConfluence('rest/api/content', {
			type: 'page',
			title: title,
			ancestors: [{ id: parentID }],
			space: { key: space },
			body: {
				storage: {
					value: source,
					representation: 'wiki',
				},
			},
		});
	}

	requestAttachFile(filePath: string, pageID: number): Promise<string> {
		return this.requestPostFormConfluence(
			`rest/api/content/${pageID}/child/attachment`,
			{
				file: `@${filePath}`,
			},
			{
				'X-Atlassian-Token': 'no-check',
			},
		);
	}

	requestAttachFileList(
		filePathList: string[],
		pageID: number,
	): Promise<string[]> {
		const requestList = filePathList.map((filePath) => {
			return {
				uri:
					this.setting.ConfURL +
					`rest/api/content/${pageID}/child/attachment`,
				method: 'POST',
				token: this.setting.ConfToken,
				forms: { file: `@${filePath}` },
				headers: { 'X-Atlassian-Token': 'no-check' },
			};
		});

		return serialRequest(requestList);
	}
}
