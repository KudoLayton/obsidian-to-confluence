export default interface ConfluencePluginSettings {
	ConfToken: string;
	ConfURL: string;
	PandocPath: string;
	defaultSpace: string;
	defaultParentDocumentID: number;
}

export const DEFAULT_SETTINGS: ConfluencePluginSettings = {
	ConfToken: '',
	ConfURL: '',
	PandocPath: '',
	defaultSpace: '',
	defaultParentDocumentID: 0,
};
