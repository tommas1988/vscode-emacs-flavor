import * as vscode from 'vscode';
import EmacsFlavor from './EmacsFlavor';

/// <reference path="./vscode_plus.d.ts" />

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
        deactiveMark();
    } else {
        mark_position = vscode.window.activeTextEditor.selection.active;
        state |= STATE_MARK_ACTIVE;
    }
}

export function exchangePointAndMark() {
    if (!mark_position) {
        return;
    }
    let point_postion = vscode.window.activeTextEditor.selection.active;

    moveCursor(true, mark_position);
    state |= STATE_MARK_ACTIVE;
    mark_position = point_postion;
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

function moveCursor(selection: boolean, position: vscode.Position) {
    let cursors = vscode.window.activeTextEditor._getCursors();
    cursors.context.model.pushStackElement();
	cursors.setStates(
		undefined,
		0,
		[
			vscode.CursorMoveCommands.moveTo(cursors.context, cursors.getPrimaryCursor(), selection, position)
		]
	);
    cursors.reveal(true, 0, /* 0: Smooth, 1: Immediate */ 1);
}