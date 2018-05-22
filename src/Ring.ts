import * as vscode from 'vscode';

abstract class Ring<T> {
    protected items: T[] = [];
    protected max: number = 10;
    public pointer: number = 0;

    protected getItem():T {
        return this.items[this.pointer];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    pop(): T {
        let length = this.items.length;
        let pointer = this.pointer;

        this.pointer = (pointer === length - 1) ? 0 : pointer + 1;;
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

export class RecenterRing extends Ring<'center' | 'top' | 'bottom'> {
    constructor() {
        super();
        this.items = [ 'center', 'top', 'bottom' ];
        this.max = 3;
    }
}