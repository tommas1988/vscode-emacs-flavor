class EmacsFlavor {
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
        'keyboard-quit',
        'recenter-top-bottom',
        'downcase-region',
        'upcase-region',
    ];

    // TODO: need a more restricted type
    private vsCommandMap: any = {
        'delete-forward-char': 'deleteRight',
    };
}