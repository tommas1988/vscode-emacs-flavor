import * as vscode from 'vscode';

abstract class Ring<T> {
    private items: T[] = [];
    private readonly max: number = 10;
    public pointer: number = 0;

    protected getItem():T {
        return this.items[this.pointer];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    pop(): T {
        let length = this.items.length;
        let pointer = (this.pointer === length - 1) ? 0 : this.pointer + 1;

        this.pointer = pointer;
        return this.items[pointer];
    }

    insert(item: T) {
        if (this.max === this.items.length) {
            this.items.pop();
        }

        this.items.unshift(item);
    }
}

export class MarkRing extends Ring<vscode.Position> {
    get mark(): vscode.Position {
        return this.getItem();
    }
}

export class KillRing extends Ring<string> {
    get kill(): string {
        return this.getItem();
    }
}