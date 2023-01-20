# Obsidian to Confluence
'Obsidian to Confluence' is a plugin that converts Obsidian markdown into Confluence wiki page.

## Features
- Converting obsidian markdown pages to [Confluence wiki](https://confluence.atlassian.com/doc/confluence-wiki-markup-251003035.html)
- Creating a wiki page on user's confluence server
- Upload attachments to the new created page

## Installation
''Obsidian to Confluence' is not listed in the obsidian community plugin list yet. (I'll do it ASAP!)
Please install the plugin manually.

### Dependencies
- [Pandoc](https://pandoc.org/installing.html)
- [cURL](https://curl.se/download.html)
  - Most Unix OS already have cURL
  - Windows 10, 11 include cURL after Windows 10 Redstone 4 update

### Manual Installation
1. Download the `obsidian-to-confluence.zip` on [releases page](https://github.com/KudoLayton/obsidian-to-confluence/releases)
2. Create a empty directory `vault/obsidian-to-confluence`
3. Extract the `obsidian-to-confluence.zip` on the directory
4. Restart Obsidian
5. Enable the plugin in the community plugins setting menu
6. Write plugin settings
7. Have fun!

## Setting
- [Confluence Personal Access Token](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html) is required for authentication.
- Default wiki space and document id are for creating new pages
  - New pages are created under the default document
  - You can find document id from the wiki page url or wiki page source url

## Compatible Obsidian Markdown
- [Headers](https://help.obsidian.md/How+to/Format+your+notes#Headers)
- [Emphasis](https://help.obsidian.md/How+to/Format+your+notes#Emphasis)
- [Lists](https://help.obsidian.md/How+to/Format+your+notes#Lists)
- [Embed Images](https://help.obsidian.md/How+to/Format+your+notes#Images)
  - Resizing is not supported
- [External links](https://help.obsidian.md/How+to/Format+your+notes#External+links)
- [Blockquotes](https://help.obsidian.md/How+to/Format+your+notes#Blockquotes)
- [Code](https://help.obsidian.md/How+to/Format+your+notes#Code)
- [Tables](https://help.obsidian.md/How+to/Format+your+notes#Tables)
  - Align is not supported
- [Strikethrough](https://help.obsidian.md/How+to/Format+your+notes#Strikethrough)

## Future Features
- [Math](https://help.obsidian.md/How+to/Format+your+notes#Math)
- [Mermaid Diagram](https://help.obsidian.md/How+to/Format+your+notes#Diagram)
- [Excalidraw](https://github.com/zsviczian/obsidian-excalidraw-plugin)
