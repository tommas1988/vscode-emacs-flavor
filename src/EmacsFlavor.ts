import * as vscode from 'vscode';
import * as EmacsCommand from './commands';

export class EmacsFlavor {
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
        'set-mark-command',
        'keyboard-quit',
        'recenter-top-bottom',
        'downcase-region',
        'upcase-region',
    ];

    // TODO: need a more restricted type
    private vsCommandMap: any = {
        'delete-forward-char': 'deleteRight',
        'goto-line': 'workbench.action.gotoLine',
    };

    private commandSuffixes: string[] = [
        'input-box',
    ];

    public constructor(context: vscode.ExtensionContext) {
        this.registerCommands(context);
    }

    private registerCommands(context: vscode.ExtensionContext) {
        this.commands.forEach(command => {
            let vsCommand = this.vsCommandMap[command];
            if (vsCommand) {
                // use builtin command
                return;
            }

            this.registerCommand(context, command);

            this.commandSuffixes.forEach(suffix => {
                this.registerCommand(context, `command.${suffix}`);
            });
        });
    }

    private registerCommand(context: vscode.ExtensionContext, command: string) {
        let handler = command.replace(/(-|\.)[a-xA-Z]/, (replacement: string) => {
            return replacement.charAt(1).toUpperCase();
        });
        
        if (!Reflect.has(EmacsCommand, handler)) {
            return;
        }

        context.subscriptions.push(vscode.commands.registerCommand(`emacs.${command}`, Reflect.get(EmacsCommand, handler)));
        console.log(`Registered handler: ${handler} for command: ${command}`);
    }
}