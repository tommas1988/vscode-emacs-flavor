import * as vscode from 'vscode';

let state: number = 0;

const STATE_MASK = 2;
const STATE_MARK_ACTIVE = 1;

type cursorMovement = 'cursorUp' | 'cursorDown' | 'cursorLeft' | 'cursorRight' | 'cursorHome' | 'cursorEnd'
    | 'cursorWordLeft' | 'cursorWordRight' | 'cursorPageDown' | 'cursorPageUp' | 'cursorTop' | 'cursorBottom';

function cursorMove(movement: cursorMovement) {
    vscode.commands.executeCommand(movement + (state & STATE_MARK_ACTIVE) ? 'Select' : '');
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