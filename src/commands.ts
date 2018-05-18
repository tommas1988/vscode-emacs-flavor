import * as vscode from 'vscode';
import EmacsFlavor from './EmacsFlavor';
import { Buffer } from './Buffer';

const buffers = new Buffer();

let state: number = 0;

const STATE_MASK = 2;
const STATE_MARK_ACTIVE = 1;

vscode.window.onDidChangeActiveTextEditor(event => {
    state &= (~STATE_MARK_ACTIVE);
});

type cursorMovement = 'cursorUp' | 'cursorDown' | 'cursorLeft' | 'cursorRight' | 'cursorHome' | 'cursorEnd'
    | 'cursorWordLeft' | 'cursorWordRight' | 'cursorPageDown' | 'cursorPageUp' | 'cursorTop' | 'cursorBottom';

function cursorMove(movement: cursorMovement) {
    vscode.commands.executeCommand(movement + ((state & STATE_MARK_ACTIVE) === 0 ? '' : 'Select'));
}

export function forwardChar() {
    cursorMove('cursorRight');
}

export function backwardChar() {
    cursorMove('cursorLeft');
}

export function nextLine() {
    cursorMove('cursorDown');
}

export function previousLine() {
    cursorMove('cursorUp');
}

export function moveBeginningOfLine() {
    cursorMove('cursorHome');
}

export function moveEndOfLine() {
    cursorMove('cursorEnd');
}

export function beginningOfBuffer() {
    cursorMove('cursorTop');
}

export function endOfBuffer() {
    cursorMove('cursorBottom');
}

export function scrollUpCommand() {
    cursorMove('cursorPageDown');
}

export function scrollDownCommand() {
    cursorMove('cursorPageUp');
}

export function setMarkCommand(emacs: EmacsFlavor) {
    if (emacs.lastCommandHandler === setMarkCommand) {
        deactiveMark();
    } else {
        let markRing = buffers.getActiveBuffer().markRing;
        markRing.marks.unshift(vscode.window.activeTextEditor.selection.active);
        markRing.pointer = 0;

        state |= STATE_MARK_ACTIVE;
    }
}

export function exchangePointAndMark() {
    let markRing = buffers.getActiveBuffer().markRing;
    if (markRing.marks.length === 0) {
        return;
    }

    let editor = vscode.window.activeTextEditor;
    let point_postion = editor.selection.active;
    let selection = new vscode.Selection(point_postion, markRing.marks[markRing.pointer]);

    editor.selection = selection;
    state |= STATE_MARK_ACTIVE;
    markRing.marks.unshift(point_postion);
}

export function keyboardQuit() {
    if (state & STATE_MARK_ACTIVE) {
        deactiveMark();
    }
}

function deactiveMark() {
    state &= (~STATE_MARK_ACTIVE);
    vscode.commands.executeCommand("cancelSelection");
}