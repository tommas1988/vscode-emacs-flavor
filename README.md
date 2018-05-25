# VSCode Emacs Flavor Keybindings

When we use some editors other than emacs with emacs keybings, we usually could find some keydings` behavior is not go with emacs. This is a painful experience, cause we have to switch our typing habit between emacs and other fake emacs keybings.

This extention is target at providing basic emacs keybings and try to make these keybinds work extractly as emacs as possible. But due to the VSCode extentions architecture, this going to be a hard work sometimes.

For example, the finding function, in emacs we use `enter` to stop at current finding position, but in VSCode press `enter` will lead use to the next finding. Due to VScode listen to these key-down event in it's own finding wedget, so we cannot change this behavior only in extentions.

## Features

* Work as emacs dose as possible.
* Keep performance in mind.
* Supporting some emacs ring concepts, like kill ring and mark ring, so there are keybings that use these rings.

## Commands

### Moving Point
| Key | Emacs Command |
|--------|------|
| `C-f` | forward-char |
| `C-b` | backward-char |
| `C-n` | next-line |
| `C-p` | previous-line |
| `C-a` | move-beginning-of-line |
| `C-e` | move-end-of-line |
| `M-f` | forward-word |
| `M-b` | right-word |
| `M->` | end-of-buffer |
| `M-<` | beginning-of-buffer |
| `C-v` | scroll-up-command |
| `M-v` | scroll-down-command |
| `C-l` | recenter-top-bottom |
| `M-g g`/ `M-g M-g` | goto-line |

### Setting Mark
| Key | Emacs Command |
|--------|------|
| `C-space` | set-mark-command |
| `C-x C-x` | exchange-point-and-mark |

*`C-u C-space` will jump to the previous marked position just as emacs dose*

### Deletion & Killing
| Key | Emacs Command |
|--------|------|
| `C-d` | delete-forward-char |
| `C-k` | kill-line |
| `C-w` | kill-region |
| `M-w` | kill-ring-save |

### Yanking
| Key | Emacs Command |
|--------|------|
| `C-y` | yank |
| `M-y` | yank-pop |

### Files & Buffer
| Key | Emacs Command |
|--------|------|
| `C-x C-s` | save-buffer |
| `C-x b` | switch-to-buffer |

### Search
| Key | Emacs Command |
|--------|------|
| `C-s` | isearch-forward |
| `C-r` | isearch-backward |

### misc.
| Key | Emacs Command |
|--------|------|
| `C-g` | keyboard-quit |
| `M-x` | execute-extended-command |
| `C-x C-l` | downcase-region |
| `C-x C-u` | upcase-region |
| `C-/` | undo |

*`undo` follows `keyboard-quit` will lead `C-/` to perform `redo`*

**Enjoy!**
