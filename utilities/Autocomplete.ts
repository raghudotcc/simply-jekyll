/************************************************************************************************
 * 
 * MIT License
 * 
 * Copyright (c) 2020 Raghuveer S
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * 
 * Author@Raghuveer S, 2019
 * This is a plugin that I use with VS Code to enable autocompletion of 
 * filenames when using wiki-style link syntax "[["
 * 
 * How to use this file:
 * ---------------------
 * Disclaimer: This is not a published plugin i.e., it is not present in the VS Code Marketplace.
 *    1. Create a VSCode Plugin template using Yeoman. (This can be googled, it's a very simple step)
 *    2. Now open the template folder that you created.
 *    3. Copy this file to the 'src' folder inside the template folder and rename it to 'extension.ts'. 
 *        If there is already a file by that name in the 'src', just replace it with this.
 *    4. Now copy the entire template folder to C:/Users/<UserName>/.vscode/
 *    5. Restart vscode and you should now find that when you are working with 'simply jekyll' posts,
 *        you have autocompletion ready to fire.
**************************************************************************************************/

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	const provider = new IncludeCompletionProvider();
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('markdown', provider, '['));
}



class IncludeCompletionProvider implements vscode.CompletionItemProvider, vscode.Disposable {
	private titles: string[] = [];
	private watcher: vscode.FileSystemWatcher;
	
	constructor() {
		this.updateTitles();

		this.watcher = vscode.workspace.createFileSystemWatcher("**/_site/Autocomplete.txt");
		this.watcher.onDidCreate(()=> this.updateTitles());
		this.watcher.onDidChange(()=> this.updateTitles());
		this.watcher.onDidDelete(()=> this.updateTitles());
	}

	public dispose() {
		this.watcher.dispose();
	}

	public provideCompletionItems (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
		let linePrefix = document.lineAt(position).text.substr(0, position.character);
		if (!linePrefix.endsWith('[[')) {
				return undefined;
		}

		let completionItemArray: vscode.CompletionItem[] = [];

		for (let entry of this.titles) {
			completionItemArray.push(new vscode.CompletionItem(entry, vscode.CompletionItemKind.Text));
		}

		return completionItemArray;
	}

	private async updateTitles() {
		if (!vscode.workspace.workspaceFolders) {
			return undefined;
		}

		const folderUri = vscode.workspace.workspaceFolders[0].uri;
		const fileUri = folderUri.with({ path: path.posix.join(folderUri.path, '_site/autocomplete.txt') });

		let titles = <string[]> undefined;

		const readData =  await vscode.workspace.fs.readFile(fileUri);
		titles = Buffer.from(readData).toString('utf8').split(";");

		this.titles = titles;
	}


}
