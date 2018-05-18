import * as vscode from 'vscode';

export interface MarkRing {
    marks: vscode.Position[],
    pointer: number,
}

export interface BufferEntry{
    markRing: MarkRing
}

export class Buffer {
    private buffers: WeakMap<vscode.TextEditor, BufferEntry> = new WeakMap();

    public getActiveBuffer(): BufferEntry {
        let editor = vscode.window.activeTextEditor;
        if (!this.buffers.has(editor)) {
            this.buffers.set(editor, {
                markRing: { marks: [], pointer: 0 },
            }); 
        }

        return this.buffers.get(editor);
    }
}