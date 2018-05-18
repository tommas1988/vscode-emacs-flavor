import * as vscode from 'vscode';
import { MarkRing } from './Ring';

export interface BufferEntry{
    markRing: MarkRing;
}

export class Buffer {
    private buffers: WeakMap<vscode.TextEditor, BufferEntry> = new WeakMap();

    public getActiveBuffer(): BufferEntry {
        let editor = vscode.window.activeTextEditor;
        if (!this.buffers.has(editor)) {
            this.buffers.set(editor, {
                markRing: new MarkRing(),
            }); 
        }

        return this.buffers.get(editor);
    }
}