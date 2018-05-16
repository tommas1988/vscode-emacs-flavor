import * as vscode from 'vscode';
import EmacsFlavor from './EmacsFlavor';

let state: number = 0;
let mark_position: vscode.Position | null = null;

const STATE_MASK = 2;
const STATE_MARK_ACTIVE = 1;

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
        state &= (~STATE_MARK_ACTIVE);
    } else {
        mark_position = vscode.window.activeTextEditor.selection.active;
        state |= STATE_MARK_ACTIVE;
    }
}