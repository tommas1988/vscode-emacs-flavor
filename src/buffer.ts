import * as vscode from 'vscode';
import { MarkRing } from './ring';

export interface BufferEntry{
    markRing: MarkRing;
}

export class Buffer {
    private buffers: WeakMap<vscode.TextEditor, BufferEntry> = new WeakMap();

    public getActiveBuffer(): BufferEntry {
        let editor = <vscode.TextEditor> vscode.window.activeTextEditor;
        if (!this.buffers.has(editor)) {
            this.buffers.set(editor, {
                markRing: new MarkRing(),
            }); 
        }

        return <BufferEntry> this.buffers.get(editor);
    }
}