import * as vscode from 'vscode';
import * as EmacsCommand from './commands';

export default class EmacsFlavor {
    private commands: string[] = [
        // Moving Point
        'forward-char',
        'backward-char',
        'next-line',
        'previous-line',
        'move-beginning-of-line',
        'move-end-of-line',
        'forward-word',
        'right-word',
        'backward-word',
        'left-word',
        'move-to-window-line-top-bottom',
        'beginning-of-buffer',
        'end-of-buffer',
        'scroll-up-command',
        'scroll-down-command',
        'goto-line',
        'set-goal-column',

        // Setting Mark
        'set-mark-command',
        'exchange-point-and-mark',
        'mark-whole-buffer',
        'pop-global-mark',
    
        // Deletion
        'delete-backward-char',
        'delete-forward-char',
        'delete-char',
        'delete-horizontal-space',
        'just-one-space',
        'delete-blank-lines',
        'delete-indentation',
    
        // Killing
        'kill-line',
        'kill-whole-line',
        'kill-region',
        'kill-ring-save',
        'kill-word',
        'backward-kill-word',
        'backward-kill-sentence',
        'kill-sentence',
        'kill-sexp',
        'zap-to-char',
    
        // Yanking
        'yank',
        'yank-pop',
        'append-next-kill',
    
        // Undo
        'undo',
    
        // Search
        'isearch-forward',
        'isearch-backward',
    
        // Files
        'find-file',
        'save-buffer',
    
        // misc.
        'keyboard-quit',
        'recenter-top-bottom',
        'downcase-region',
        'upcase-region',
    ];

    // TODO: need a more restricted type
    private vsCommandMap: any = {
        'delete-forward-char': 'deleteRight',
        'goto-line': 'workbench.action.gotoLine',
        'downcase-region': 'editor.action.transformToLowercase',
        'upcase-region': 'editor.action.transformToUppercase',
    };

    private commandSuffixes: string[] = [
        'input-box',
    ];

    public static readonly COMMAND_UNHANDLED = -1;

    public readonly STATE_MARK_ACTIVE = 1;
    public readonly STATE_MASK = 2;

    public lastCommandHandler: ((...args: any[]) => any) | null = null;

    public state: number = 0;

    public redoSwitch: boolean = false;

    public init(context: vscode.ExtensionContext) {
        this.registerCommands(context);

        vscode.window.onDidChangeActiveTextEditor(event => {
            this.state &= (~this.STATE_MARK_ACTIVE);
			this.redoSwitch = false;
		});

        vscode.workspace.onDidChangeTextDocument(e => {
            this.state &= (~this.STATE_MARK_ACTIVE);

            if (EmacsCommand.undo !== this.lastCommandHandler) {
                this.redoSwitch = false;
            }
        });
    }

    private registerCommands(context: vscode.ExtensionContext) {
        this.commands.forEach(command => {
            let vsCommand = this.vsCommandMap[command];
            if (vsCommand) {
                // use builtin command
                console.log(`Registered command: ${command}`);
                return;
            }

            this.registerCommand(context, command);

            this.commandSuffixes.forEach(suffix => {
                this.registerCommand(context, `command.${suffix}`);
            });
        });
    }

    private registerCommand(context: vscode.ExtensionContext, command: string) {
        let handlerName = command.replace(/(-|\.)[a-xA-Z]/g, (replacement: string) => {
            return replacement.charAt(1).toUpperCase();
        });

        if (!Reflect.has(EmacsCommand, handlerName)) {
            return;
        }

        context.subscriptions.push(vscode.commands.registerCommand(`emacs.${command}`, () => {
            let handler = Reflect.get(EmacsCommand, handlerName);
            // handler.apply(this);
            if (handler(this) !== EmacsFlavor.COMMAND_UNHANDLED) {
                this.lastCommandHandler = handler;
            }
        }));
        console.log(`Registered command: ${command}`);
    }
}