// Note: This test is leveraging the Mocha test framework (https://mochajs.org/)

//import * as assert from 'assert';
//import * as vscode from 'vscode';
//import { Position, Range, Selection, TextEditor, TextEditorEdit, EndOfLine } from 'vscode';

//import * as myExtension from '../../extension';


suite("morpheme-handler", () => {
    /*
    // Prepare utility functions and constants
    const setText = async function (editor: TextEditor, text: string) {
        return editor.edit((editBuilder: TextEditorEdit) => {
            const doc = editor.document;
            const startPos = new Position(0, 0);
            const lastLine = doc.lineAt(doc.lineCount - 1);
            const endPos = lastLine.range.end;
            const entireRange = new Range(startPos, endPos);
            editBuilder.replace(entireRange, text);
            editBuilder.setEndOfLine(EndOfLine.LF);
        });
    };

    suiteSetup(async () => {
        const uri = vscode.Uri.parse("untitled:test.txt");
        await vscode.window.showTextDocument(uri);
    });

    suiteTeardown(async () => {
        const commandName = "workbench.action.closeAllEditors";
        await vscode.commands.executeCommand(commandName);
    });

    suite("cursorWordEndLeft", () => {
        const doMine = async function (
            editor: TextEditor,
            wordSeparators: string,
            content: string
        ) {
            await setText(editor, content);
            const initPos = editor.document.positionAt(content.length);
            editor.selections = [new Selection(initPos, initPos)];
            await myExtension.cursorWordEndLeft(editor, wordSeparators);
            return editor.document.offsetAt(editor.selection.start);
        };

        const doTheirs = async function (
            editor: TextEditor,
            content: string
        ) {
            await setText(editor, content);
            const initPos = editor.document.positionAt(content.length);
            editor.selections = [new Selection(initPos, initPos)];
            await vscode.commands.executeCommand("cursorWordEndLeft");
            return editor.document.offsetAt(editor.selection.start);
        };

        [
            { name: "  .", input: "", expected: 0, compatible: true, },

            { name: " .A", input: "aa", expected: 0, compatible: true, },
            { name: " HA", input: "???aa", expected: 1, compatible: false, },
            { name: " KA", input: "???aa", expected: 1, compatible: false, },
            { name: " JA", input: "???aa", expected: 1, compatible: false, },
            { name: ".SA", input: " aa", expected: 0, compatible: true, },
            { name: "ASA", input: "a aa", expected: 1, compatible: true, },
            { name: "HSA", input: "??? aa", expected: 1, compatible: true, },
            { name: "LSA", input: "\n aa", expected: 1, compatible: true, },
            { name: " LA", input: "\naa", expected: 1, compatible: true, },

            { name: " .H", input: "??????", expected: 0, compatible: true, },
            { name: " AH", input: "a??????", expected: 1, compatible: false, },
            { name: " KH", input: "?????????", expected: 1, compatible: false, },
            { name: " JH", input: "?????????", expected: 1, compatible: false, },
            { name: ".SH", input: " ??????", expected: 0, compatible: true, },
            { name: "ASH", input: "a ??????", expected: 1, compatible: true, },
            { name: "HSH", input: "??? ??????", expected: 1, compatible: true, },
            { name: "LSH", input: "\n ??????", expected: 1, compatible: true, },
            { name: " LH", input: "\n??????", expected: 1, compatible: true, },

            { name: " .K", input: "??????", expected: 0, compatible: true, },
            { name: " AK", input: "a??????", expected: 1, compatible: false, },
            { name: " HK", input: "?????????", expected: 1, compatible: false, },
            { name: " JK", input: "?????????", expected: 1, compatible: false, },
            { name: ".SK", input: " ??????", expected: 0, compatible: true, },
            { name: "ASK", input: "a ??????", expected: 1, compatible: true, },
            { name: "HSK", input: "??? ??????", expected: 1, compatible: true, },
            { name: "LSK", input: "\n ??????", expected: 1, compatible: true, },
            { name: " LK", input: "\n??????", expected: 1, compatible: true, },

            { name: " .J", input: "??????", expected: 0, compatible: true, },
            { name: " AJ", input: "a??????", expected: 1, compatible: false, },
            { name: " HJ", input: "?????????", expected: 1, compatible: false, },
            { name: " KJ", input: "?????????", expected: 1, compatible: false, },
            { name: ".SJ", input: " ??????", expected: 0, compatible: true, },
            { name: "ASJ", input: "a ??????", expected: 1, compatible: true, },
            { name: "HSJ", input: "??? ??????", expected: 1, compatible: true, },
            { name: "LSJ", input: "\n ??????", expected: 1, compatible: true, },
            { name: " LJ", input: "\n??????", expected: 1, compatible: true, },

            { name: ".S", input: "  ", expected: 0, compatible: true, },
            { name: "AS", input: "aa  ", expected: 2, compatible: true, },
            { name: "HS", input: "??????  ", expected: 2, compatible: true, },
            { name: "KS", input: "??????  ", expected: 2, compatible: true, },
            { name: "JS", input: "??????  ", expected: 2, compatible: true, },
            { name: "LS", input: "\n  ", expected: 1, compatible: true, },

            { name: ".L", input: "\n", expected: 0, compatible: true, },
            { name: "AL", input: "a\n", expected: 1, compatible: false, },  //TODO: should be compatible
            { name: "HL", input: "???\n", expected: 1, compatible: false },
            { name: "KL", input: "???\n", expected: 1, compatible: false },
            { name: "JL", input: "???\n", expected: 1, compatible: false },
            { name: "SL", input: " \n", expected: 1, compatible: false, },  //TODO: should be compatible
            { name: "LL", input: "\n\n", expected: 1, compatible: true, },
        ].forEach(t => {
            test(t.name, async () => {
                const editor = vscode.window.activeTextEditor!;
                const mine = await doMine(editor, "", t.input);
                if (mine !== t.expected) {
                    assert.fail("Unexpected result: {" +
                        escape`input: "${t.input}", ` +
                        escape`expected: "${t.expected}", ` +
                        escape`got: "${mine}"}`
                    );
                }
                if (t.compatible) {
                    const theirs = await doTheirs(editor, t.input);
                    if (mine !== theirs) {
                        assert.fail("Incompatible behavior: {" +
                            escape`input: "${t.input}", ` +
                            escape`mine: "${mine}", ` +
                            escape`theirs: "${theirs}"}`
                        );
                    }
                }
            });
        });
    });

    suite("cursorWordEndRight", () => {

        const testSingleCursorMotion = async function (
            editor: TextEditor,
            wordSeparators: string,
            content: string
        ) {
            await setText(editor, content);
            const initPos = new Position(0, 0);
            editor.selections = [new Selection(initPos, initPos)];
            myExtension.cursorWordEndRight(editor, wordSeparators);
            return editor.selection.active;
        };

        test("motion: starting from end-of-document",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", "");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 0);
            });

        test("motion: starting from end-of-line",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", "\n");
                assert.equal(cursorPos.line, 1);
                assert.equal(cursorPos.character, 0);
            });

        test("motion: should skip a WSP at cursor",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", " Foo");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 4);
            });

        test("motion: should skip multiple WSPs at cursor",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", " \t Foo");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 6);
            });

        test("motion: should stop at end-of-document after skipping WSPs",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", " ");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 1);
            });

        test("motion: should stop at beginning of a line just after an EOL",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "\norange");
                assert.equal(cursorPos.line, 1);
                assert.equal(cursorPos.character, 0);
            });

        test("motion: should skip only the first EOL in a series of EOLs",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "\n\norange");
                assert.equal(cursorPos.line, 1);
                assert.equal(cursorPos.character, 0);
            });

        test("motion: should stop on char-class change (alnum -> punctuation)",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", "HbA1c???");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 5);
            });

        test("motion: should stop on char-class change (alnum -> hiragana)",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", "HbA1c??????");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 5);
            });

        test("motion: should stop on char-class change (hiragana -> katakana)",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", "????????????");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 2);
            });

        test("motion: should stop on char-class change (katakana -> other)",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", "????????????");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 2);
            });

        test("motion: should stop on char-class change (other -> WSP)",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", "??????\t ");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 2);
            });

        test("motion: should stop at end-of-line",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "apple\norange");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 5);
            });

        test("motion: should stop at end-of-document",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "apple");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 5);
            });
    });

    suite("cursorWordStartLeft", () => {

        const testSingleCursorMotion = async function (
            editor: TextEditor,
            wordSeparators: string,
            content: string
        ) {
            await setText(editor, content);
            const initPos = editor.document.positionAt(
                content.length * 2); // LFs may become CRLFs
            editor.selections = [new Selection(initPos, initPos)];
            myExtension.cursorWordStartLeft(editor, wordSeparators);
            return editor.selection.active;
        };

        test("motion: starting from start-of-document",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", "");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 0);
            });

        test("motion: starting from start-of-line",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", "\n");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 0);
            });

        test("motion: should skips a WSP",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", "Foo ");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 0);
            });

        test("motion: should skip multiple WSPs",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", "Foo \t");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 0);
            });

        test("motion: should stop at start-of-document after skipping WSPs",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor,
                    "", " ");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 0);
            });

        test("motion: should not go over an EOL if not from start of the line",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "\nFoo");
                assert.equal(cursorPos.line, 1);
                assert.equal(cursorPos.character, 0);
            });

        test("motion: should go over an EOL from start of the line",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "Foo\n");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 3);
            });

        test("motion: should stop on char-class change (alnum -> punctuation)",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "!HbA1c");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 1);
            });

        test("motion: should stop on char-class change (alnum -> hiragana)",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "??????HbA1c");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 2);
            });

        test("motion: should stop on char-class change (hiragana -> katakana)",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "????????????");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 2);
            });

        test("motion: should stop on char-class change (katakana -> other)",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "????????????");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 2);
            });

        test("motion: should stop on char-class change (other -> WSP)",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "\t ??????");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 2);
            });

        test("motion: should stop at start-of-line",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "Foo\nBar");
                assert.equal(cursorPos.line, 1);
                assert.equal(cursorPos.character, 0);
            });

        test("motion: should stop at start-of-document",
            async () => {
                const editor = vscode.window.activeTextEditor!;
                const cursorPos = await testSingleCursorMotion(editor, "",
                    "Foo");
                assert.equal(cursorPos.line, 0);
                assert.equal(cursorPos.character, 0);
            });
    });

    suite("cursorWordStartRight", () => {
        const doMine = async function (
            editor: TextEditor,
            wordSeparators: string,
            content: string
        ) {
            await setText(editor, content);
            const initPos = new Position(0, 0);
            editor.selections = [new Selection(initPos, initPos)];
            await myExtension.cursorWordStartRight(editor, wordSeparators);
            return editor.document.offsetAt(editor.selection.start);
        };

        const doTheirs = async function (
            editor: TextEditor,
            content: string
        ) {
            await setText(editor, content);
            const initPos = new Position(0, 0);
            editor.selections = [new Selection(initPos, initPos)];
            await vscode.commands.executeCommand("cursorWordStartRight");
            return editor.document.offsetAt(editor.selection.start);
        };

        [
            { name: ".", input: "", expected: 0, compatible: true, },

            { name: "A.", input: "aa", expected: 2, compatible: true, },
            { name: "AH", input: "aa???", expected: 2, compatible: false, },
            { name: "AK", input: "aa???", expected: 2, compatible: false, },
            { name: "AJ", input: "aa???", expected: 2, compatible: false, },
            { name: "AS.", input: "aa ", expected: 3, compatible: true, },
            { name: "ASA", input: "aa a", expected: 3, compatible: true, },
            { name: "ASH", input: "aa ???", expected: 3, compatible: true, },
            { name: "ASL", input: "aa \n", expected: 3, compatible: true, },
            { name: "AL", input: "aa\n", expected: 2, compatible: true, },

            { name: "H.", input: "??????", expected: 2, compatible: true, },
            { name: "HA", input: "??????a", expected: 2, compatible: false, },
            { name: "HK", input: "?????????", expected: 2, compatible: false, },
            { name: "HJ", input: "?????????", expected: 2, compatible: false, },
            { name: "HS.", input: "?????? ", expected: 3, compatible: true, },
            { name: "HSA", input: "?????? a", expected: 3, compatible: true, },
            { name: "HSH", input: "?????? ???", expected: 3, compatible: true, },
            { name: "HSL", input: "?????? \n", expected: 3, compatible: true, },
            { name: "HL", input: "??????\n", expected: 2, compatible: true, },

            { name: "K.", input: "??????", expected: 2, compatible: true, },
            { name: "KA", input: "??????a", expected: 2, compatible: false, },
            { name: "KH", input: "?????????", expected: 2, compatible: false, },
            { name: "KJ", input: "?????????", expected: 2, compatible: false, },
            { name: "KS.", input: "?????? ", expected: 3, compatible: true, },
            { name: "KSA", input: "?????? a", expected: 3, compatible: true, },
            { name: "KSH", input: "?????? ???", expected: 3, compatible: true, },
            { name: "KSL", input: "?????? \n", expected: 3, compatible: true, },
            { name: "KL", input: "??????\n", expected: 2, compatible: true, },

            { name: "J.", input: "??????", expected: 2, compatible: true, },
            { name: "JA", input: "??????a", expected: 2, compatible: false, },
            { name: "JH", input: "?????????", expected: 2, compatible: false, },
            { name: "JK", input: "?????????", expected: 2, compatible: false, },
            { name: "JS.", input: "?????? ", expected: 3, compatible: true, },
            { name: "JSA", input: "?????? a", expected: 3, compatible: true, },
            { name: "JSH", input: "?????? ???", expected: 3, compatible: true, },
            { name: "JSL", input: "?????? \n", expected: 3, compatible: true, },
            { name: "JL", input: "??????\n", expected: 2, compatible: true, },

            { name: "S.", input: "  ", expected: 2, compatible: true, },
            { name: "SA", input: "  aa", expected: 2, compatible: true, },
            { name: "SH", input: "  ??????", expected: 2, compatible: true, },
            { name: "SK", input: "  ??????", expected: 2, compatible: true, },
            { name: "SJ", input: "  ??????", expected: 2, compatible: true, },
            { name: "SL", input: "  \n", expected: 2, compatible: true, },

            { name: "L.", input: "\n", expected: 1, compatible: true, },
            { name: "LA", input: "\na", expected: 1, compatible: true, },
            { name: "LH", input: "\n???", expected: 1, compatible: false },
            { name: "LK", input: "\n???", expected: 1, compatible: false },
            { name: "LJ", input: "\n???", expected: 1, compatible: false },
            { name: "LS", input: "\n ", expected: 1, compatible: false, },  //TODO: should be compatible
            { name: "LL", input: "\n\n", expected: 1, compatible: true, },
        ].forEach(t => {
            test("cursorWordStartRight: " + t.name, async () => {
                const editor = vscode.window.activeTextEditor!;
                const mine = await doMine(editor, "", t.input);
                if (mine !== t.expected) {
                    assert.fail("Unexpected result: {" +
                        escape`input: "${t.input}", ` +
                        escape`expected: "${t.expected}", ` +
                        escape`got: "${mine}"}`
                    );
                }
                if (t.compatible) {
                    const theirs = await doTheirs(editor, t.input);
                    if (mine !== theirs) {
                        assert.fail("Incompatible behavior: {" +
                            escape`input: "${t.input}", ` +
                            escape`mine: "${mine}", ` +
                            escape`theirs: "${theirs}"}`
                        );
                    }
                }
            });
        });
    });

    suite("deleteWordEndRight", () => {
        const doMine = async function (
            editor: TextEditor,
            wordSeparators: string,
            content: string
        ) {
            await setText(editor, content);
            const initPos = new Position(0, 0);
            editor.selections = [new Selection(initPos, initPos)];
            await myExtension.deleteWordEndRight(editor, wordSeparators);
            return editor.document.getText();
        };

        const doTheirs = async function (
            editor: TextEditor,
            command: string,
            content: string
        ) {
            await setText(editor, content);
            const initPos = new Position(0, 0);
            editor.selections = [new Selection(initPos, initPos)];
            await vscode.commands.executeCommand(command);
            return editor.document.getText();
        };

        // Range
        [
            { name: ".", input: "", expected: "", compatible: true, },

            { name: "A.", input: "aa", expected: "", compatible: true, },
            { name: "AH", input: "aa???", expected: "???", compatible: false, },
            { name: "AK", input: "aa???", expected: "???", compatible: false, },
            { name: "AJ", input: "aa???", expected: "???", compatible: false, },
            { name: "AL", input: "aa\n", expected: "\n", compatible: true, },
            { name: "AS", input: "aa ", expected: " ", compatible: true, },

            { name: "H.", input: "??????", expected: "", compatible: true, },
            { name: "HA", input: "??????a", expected: "a", compatible: false, },
            { name: "HK", input: "?????????", expected: "???", compatible: false, },
            { name: "HJ", input: "?????????", expected: "???", compatible: false, },
            { name: "HL", input: "??????\n", expected: "\n", compatible: true, },
            { name: "HS", input: "?????? ", expected: " ", compatible: true, },

            { name: "K.", input: "??????", expected: "", compatible: true, },
            { name: "KA", input: "??????a", expected: "a", compatible: false, },
            { name: "KH", input: "?????????", expected: "???", compatible: false, },
            { name: "KJ", input: "?????????", expected: "???", compatible: false, },
            { name: "KL", input: "??????\n", expected: "\n", compatible: true, },
            { name: "KS", input: "?????? ", expected: " ", compatible: true, },

            { name: "J.", input: "??????", expected: "", compatible: true, },
            { name: "JA", input: "??????a", expected: "a", compatible: false, },
            { name: "JH", input: "?????????", expected: "???", compatible: false, },
            { name: "JK", input: "?????????", expected: "???", compatible: false, },
            { name: "JL", input: "??????\n", expected: "\n", compatible: true, },
            { name: "JS", input: "?????? ", expected: " ", compatible: true, },

            { name: "L.", input: "\n", expected: "", compatible: true, },
            { name: "LA", input: "\na", expected: "a", compatible: true, },
            { name: "LH", input: "\n???", expected: "???", compatible: false },
            { name: "LK", input: "\n???", expected: "???", compatible: false },
            { name: "LJ", input: "\n???", expected: "???", compatible: false },
            { name: "LL", input: "\n\n", expected: "\n", compatible: true, },
            { name: "LS.", input: "\n ", expected: " ", compatible: false, },  //TODO: should be compatible

            { name: "S.", input: " ", expected: "", compatible: true, },
            { name: "SA.", input: " aa", expected: "", compatible: true, },
            { name: "SAL", input: " aa\n", expected: "\n", compatible: true, },
            { name: "SAS", input: " aa ", expected: " ", compatible: true, },
            { name: "SH.", input: " ??????", expected: "", compatible: true, },
            { name: "SHL", input: " ??????\n", expected: "\n", compatible: true, },
            { name: "SHS", input: " ?????? ", expected: " ", compatible: true, },
            { name: "SK.", input: " ??????", expected: "", compatible: true, },
            { name: "SKL", input: " ??????\n", expected: "\n", compatible: true, },
            { name: "SKS", input: " ?????? ", expected: " ", compatible: true, },
            { name: "SJ.", input: " ??????", expected: "", compatible: true, },
            { name: "SJL", input: " ??????\n", expected: "\n", compatible: true, },
            { name: "SJS", input: " ?????? ", expected: " ", compatible: true, },
            { name: "SL", input: " \n", expected: "\n", compatible: true, },
            { name: "SS.", input: "  ", expected: "", compatible: true, },
            { name: "SSA.", input: "  aa", expected: "", compatible: false, },
            { name: "SSL", input: "  \n", expected: "\n", compatible: true, },
        ].forEach(t => {
            test("range: " + t.name, async () => {
                const editor = vscode.window.activeTextEditor!;
                const mine = await doMine(editor, "", t.input);
                if (mine !== t.expected) {
                    assert.fail("Unexpected result: {" +
                        escape`input: "${t.input}", ` +
                        escape`expected: "${t.expected}", ` +
                        escape`got: "${mine}"}`
                    );
                }
                if (t.compatible) {
                    const cmd = "deleteWordEndRight";
                    const theirs = await doTheirs(editor, cmd, t.input);
                    if (mine !== theirs) {
                        assert.fail("Incompatible behavior: {" +
                            escape`input: "${t.input}", ` +
                            escape`mine: "${mine}", ` +
                            escape`theirs: "${theirs}"}`
                        );
                    }
                }
            });
        });

        test("undo",
            async () => {
                const editor = vscode.window.activeTextEditor!;

                // Execute my command
                const mine = await doMine(editor, "", "abc");
                assert.equal(mine, "");

                // Undo and check the result
                await vscode.commands.executeCommand("undo");
                const text = await editor.document.getText();
                assert.equal(text, "abc");
            });
    });

    suite("deleteWordStartLeft", () => {
        const doMine = async function (
            editor: TextEditor,
            wordSeparators: string,
            content: string
        ) {
            await setText(editor, content);
            const initPos = editor.document.positionAt(
                content.length * 2); // LFs may become CRLFs
            editor.selections = [new Selection(initPos, initPos)];
            await myExtension.deleteWordStartLeft(editor, wordSeparators);
            return editor.document.getText();
        };

        const doTheirs = async function (
            editor: TextEditor,
            content: string
        ) {
            await setText(editor, content);
            const initPos = editor.document.positionAt(
                content.length * 2); // LFs may become CRLFs
            editor.selections = [new Selection(initPos, initPos)];
            await vscode.commands.executeCommand("deleteWordStartLeft");
            return editor.document.getText();
        };

        // Range
        [
            { name: ".", input: "", expected: "", compatible: true },

            { name: "A.", input: "aa", expected: "", compatible: true },
            { name: "AH", input: "???aa", expected: "???", compatible: false },
            { name: "AK", input: "???aa", expected: "???", compatible: false },
            { name: "AJ", input: "???aa", expected: "???", compatible: false },
            { name: "AL", input: "\naa", expected: "\n", compatible: true },
            { name: "AS", input: " aa", expected: " ", compatible: true },

            { name: "H.", input: "??????", expected: "", compatible: true },
            { name: "HA", input: "a??????", expected: "a", compatible: false },
            { name: "HK", input: "?????????", expected: "???", compatible: false },
            { name: "HJ", input: "?????????", expected: "???", compatible: false },
            { name: "HL", input: "\n??????", expected: "\n", compatible: true },
            { name: "HS", input: " ??????", expected: " ", compatible: true },

            { name: "K.", input: "??????", expected: "", compatible: true },
            { name: "KA", input: "a??????", expected: "a", compatible: false },
            { name: "KH", input: "?????????", expected: "???", compatible: false },
            { name: "KJ", input: "?????????", expected: "???", compatible: false },
            { name: "KL", input: "\n??????", expected: "\n", compatible: true },
            { name: "KS", input: " ??????", expected: " ", compatible: true },

            { name: "J.", input: "??????", expected: "", compatible: true },
            { name: "JA", input: "a??????", expected: "a", compatible: false },
            { name: "JH", input: "?????????", expected: "???", compatible: false },
            { name: "JK", input: "?????????", expected: "???", compatible: false },
            { name: "JL", input: "\n??????", expected: "\n", compatible: true },
            { name: "JS", input: " ??????", expected: " ", compatible: true },

            { name: "L.", input: "\n", expected: "", compatible: true },
            { name: "LA", input: "a\n", expected: "a", compatible: true },
            { name: "LH", input: "???\n", expected: "???", compatible: false },
            { name: "LK", input: "???\n", expected: "???", compatible: false },
            { name: "LJ", input: "???\n", expected: "???", compatible: false },
            //BUG//{ name: "LL", input: "\n\n", expected: "\n", compatible: true },  //TODO: fix this
            { name: "LS.", input: " \n", expected: " ", compatible: false },  //TODO: should be compatible

            { name: "S.", input: " ", expected: "", compatible: true },
            { name: "SA.", input: "aa ", expected: "", compatible: true },
            { name: "SAL", input: "\naa ", expected: "\n", compatible: true },
            { name: "SAS", input: " aa ", expected: " ", compatible: true },
            { name: "SH.", input: "?????? ", expected: "", compatible: true },
            { name: "SHL", input: "\n?????? ", expected: "\n", compatible: true },
            { name: "SHS", input: " ?????? ", expected: " ", compatible: true },
            { name: "SK.", input: "?????? ", expected: "", compatible: true },
            { name: "SKL", input: "\n?????? ", expected: "\n", compatible: true },
            { name: "SKS", input: " ?????? ", expected: " ", compatible: true },
            { name: "SJ.", input: "?????? ", expected: "", compatible: true },
            { name: "SJL", input: "\n?????? ", expected: "\n", compatible: true },
            { name: "SJS", input: " ?????? ", expected: " ", compatible: true },
            //BUG//{ name: "SL", input: "\n ", expected: "\n", compatible: true },  //TODO: fix this
            { name: "SS.", input: "  ", expected: "", compatible: true },
            { name: "SSA.", input: "aa  ", expected: "", compatible: false },
            //BUG//{ name: "SSL", input: "\n  ", expected: "\n", compatible: true },  //TODO: fix this
        ].forEach(t => {
            test("range: " + t.name, async () => {
                const editor = vscode.window.activeTextEditor!;
                const mine = await doMine(editor, "", t.input);
                if (mine !== t.expected) {
                    assert.fail("Unexpected result: {" +
                        escape`input: "${t.input}", ` +
                        escape`expected: "${t.expected}", ` +
                        escape`got: "${mine}"}`
                    );
                }
                if (t.compatible) {
                    const theirs = await doTheirs(editor, t.input);
                    if (mine !== theirs) {
                        assert.fail("Incompatible behavior: {" +
                            escape`input: "${t.input}", ` +
                            escape`mine: "${mine}", ` +
                            escape`theirs: "${theirs}"}`
                        );
                    }
                }
            });
        });

        test("undo",
            async () => {
                const editor = vscode.window.activeTextEditor!;

                // Execute my command
                const mine = await doMine(editor, "", "abc");
                assert.equal(mine, "");

                // Undo and check the result
                await vscode.commands.executeCommand("undo");
                const text = await editor.document.getText();
                assert.equal(text, "abc");
            });
    });
    */
});

function escape(template: TemplateStringsArray, ...substitutions: any[]): string {
    return String.raw(template, substitutions)
        .replace(/\n/g, '\\n');
}
