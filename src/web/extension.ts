//import * as vscode from 'vscode';
//import * as kuromoji from 'kuromoji';

//let kuromojiBuilder: any;

import * as vscode from 'vscode';
import * as kuromoji from 'kuromoji';

let kuromojiBuilder: any;
let kuromojiToken: any;

function kuromojiInit() {
    kuromojiBuilder.build((err: any, tokenizer: any) => {
        kuromojiToken = new tokenizer.tokenize;
    });
}

export function activate(context: vscode.ExtensionContext) {
    console.log('activation!');
    function registerCommand(name: string, logic: Function) {
        let command = vscode.commands.registerCommand(
            name,
            () => {
                let editor = vscode.window.activeTextEditor!;
                let wordSeparators = vscode.workspace
                    .getConfiguration("editor", editor.document.uri)
                    .get("wordSeparators");
                logic(editor, wordSeparators);
            });
        context.subscriptions.push(command);
    };

    // Register commands
    registerCommand('morphemeHandler.showMorpheme', showMorpheme);


    kuromojiBuilder = kuromoji.builder({
        dicPath: context.extensionPath + '/node_modules/kuromoji/dict'
    });
    kuromojiInit();
}

function showMorpheme(){

}