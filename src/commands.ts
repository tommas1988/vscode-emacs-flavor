import * as vscode from 'vscode';
import * as clipboard from 'clipboardy';
import EmacsFlavor from './EmacsFlavor';
import { Buffer } from './Buffer';
import { KillRing } from './Ring';

/// <reference path="./vscode-plus.d.ts" />

const buffers = new Buffer();
const killRing = new KillRing();

type cursorMovement = 'cursorUp' | 'cursorDown' | 'cursorLeft' | 'cursorRight' | 'cursorHome' | 'cursorEnd'
    | 'cursorWordLeft' | 'cursorWordRight' | 'cursorPageDown' | 'cursorPageUp' | 'cursorTop' | 'cursorBottom';

function cursorMove(emacs: EmacsFlavor, movement: cursorMovement) {
    vscode.commands.executeCommand(movement + ((emacs.state & emacs.STATE_MARK_ACTIVE) === 0 ? '' : 'Select'));
}

export function forwardChar(emacs: EmacsFlavor) {
    cursorMove(emacs, 'cursorRight');
}

export function backwardChar(emacs: EmacsFlavor) {
    cursorMove(emacs, 'cursorLeft');
}

export function nextLine(emacs: EmacsFlavor) {
    cursorMove(emacs, 'cursorDown');
}

export function previousLine(emacs: EmacsFlavor) {
    cursorMove(emacs, 'cursorUp');
}

export function moveBeginningOfLine(emacs: EmacsFlavor) {
    cursorMove(emacs, 'cursorHome');
}

export function moveEndOfLine(emacs: EmacsFlavor) {
    cursorMove(emacs, 'cursorEnd');
}

export function beginningOfBuffer(emacs: EmacsFlavor) {
    cursorMove(emacs, 'cursorTop');
}

export function endOfBuffer(emacs: EmacsFlavor) {
    cursorMove(emacs, 'cursorBottom');
}

export function scrollUpCommand(emacs: EmacsFlavor) {
    cursorMove(emacs, 'cursorPageDown');
}

export function scrollDownCommand(emacs: EmacsFlavor) {
    cursorMove(emacs, 'cursorPageUp');
}

export function setMarkCommand(emacs: EmacsFlavor) {
    if (emacs.lastCommandHandler === setMarkCommand) {
        deactiveMark(emacs);
    } else {
        let markRing = buffers.getActiveBuffer().markRing;
        markRing.insert((<vscode.TextEditor> vscode.window.activeTextEditor).selection.active);
        markRing.pointer = 0;

        emacs.state |= emacs.STATE_MARK_ACTIVE;
    }
}

export function exchangePointAndMark(emacs: EmacsFlavor) {
    let markRing = buffers.getActiveBuffer().markRing;
    if (markRing.isEmpty()) {
        return EmacsFlavor.COMMAND_UNHANDLED;
    }

    let editor = <vscode.TextEditor> vscode.window.activeTextEditor;
    let pointPosition = editor.selection.active;
    let selection = new vscode.Selection(pointPosition, markRing.mark);

    editor.selection = selection;
    emacs.state |= emacs.STATE_MARK_ACTIVE;
    markRing.insert(pointPosition);
}

export function keyboardQuit(emacs: EmacsFlavor) {
    if (emacs.state & emacs.STATE_MARK_ACTIVE) {
        deactiveMark(emacs);
    }

    if (undo === emacs.lastCommandHandler) {
        emacs.redoSwitch = !emacs.redoSwitch;
    }
}

function deactiveMark(emacs: EmacsFlavor) {
    emacs.state &= (~emacs.STATE_MARK_ACTIVE);
    vscode.commands.executeCommand("cancelSelection");
}

export function killLine() {
    let editor  = <vscode.TextEditor> vscode.window.activeTextEditor;
    let document: vscode.TextDocument = editor.document;
    let pointPosition = editor.selection.active;
    let line: vscode.TextLine = document.lineAt(pointPosition);

    let range: vscode.Range = line.range.with(pointPosition);
    let text = document.getText(range);
    if (!text || /^\s*$/.test(text)) {
        range = line.rangeIncludingLineBreak.with(pointPosition);
    }

    editor.edit((editBuilder) => {
        editBuilder.delete(range);
        killRing.insert(document.getText(range));
    });
}

export function killRegion(emacs: EmacsFlavor) {
    if (!(emacs.state & emacs.STATE_MARK_ACTIVE)) {
        return EmacsFlavor.COMMAND_UNHANDLED;
    }

    let editor = <vscode.TextEditor> vscode.window.activeTextEditor;
    let range = editor.selection;
    let text = editor.document.getText(range);

    editor.edit((editBuilder) => {
        editBuilder.delete(range);
        emacs.state &= (~emacs.STATE_MARK_ACTIVE);
    });

    killRing.insert(text);
    clipboard.write(text).catch(err => {
        console.log(err);
    });
}

export function killRingSave(emacs: EmacsFlavor) {
    if (!(emacs.state & emacs.STATE_MARK_ACTIVE)) {
        return EmacsFlavor.COMMAND_UNHANDLED;
    }

    let editor = <vscode.TextEditor> vscode.window.activeTextEditor;
    let text = editor.document.getText(editor.selection);

    deactiveMark(emacs);
    killRing.insert(text);
    clipboard.write(text).catch(err => {
        console.log(err);
    });
}

export function yank() {
    let text = clipboard.readSync();
    if (!text) {
        return EmacsFlavor.COMMAND_UNHANDLED;
    }

    let editor = <vscode.TextEditor> vscode.window.activeTextEditor;
    let pointPosition = editor.selection.active;

    buffers.getActiveBuffer().markRing.insert(pointPosition);
    editor.edit(editBuilder => {
        editBuilder.insert(pointPosition, text);
    });
}

export function yankPop(emacs: EmacsFlavor) {
    let lastCommand = emacs.lastCommandHandler;
    if (lastCommand !== yankPop && lastCommand !== yank) {
        return EmacsFlavor.COMMAND_UNHANDLED;
    }

    let text = killRing.pop();
    if (!text) {
        return;
    }

    let editor = <vscode.TextEditor> vscode.window.activeTextEditor;
    let pointPosition = editor.selection.active;
    let range = new vscode.Range(buffers.getActiveBuffer().markRing.mark, pointPosition);

    editor.edit(editBuilder => {
        editBuilder._pushEdit(range, text, true);
    });
}

export function undo(emacs: EmacsFlavor) {
    let action = emacs.redoSwitch ? 'redo' : 'undo';
    vscode.window.setStatusBarMessage(action, 1000);
    vscode.commands.executeCommand(action);
}