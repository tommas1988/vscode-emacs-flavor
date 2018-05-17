declare module 'vscode' {
    export interface TextEditor {
        _getCursors(): any;
    }

    export class CursorMoveCommands {
        public static moveTo(context: any, cursor: any, selection: boolean, position: any): any;
    }
}