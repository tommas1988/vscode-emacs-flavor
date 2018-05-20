declare module 'vscode' {
    export interface TextEditorEdit {
        _pushEdit(range: Range, text: string, forceMoveMarkers: boolean): void;
    }
}