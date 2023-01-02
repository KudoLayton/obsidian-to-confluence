
import * as fs from 'fs';

export default interface ConfluencePluginSettings {
	ConfToken: string;
  ConfURL: string;
}

export const DEFAULT_SETTINGS: ConfluencePluginSettings = {
	ConfToken: '',
  ConfURL: ''
}

