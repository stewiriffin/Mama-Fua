// Keyboard shortcuts utility

export type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
};

export class KeyboardShortcutManager {
  private shortcuts: KeyboardShortcut[] = [];
  private isListening = false;

  register(shortcut: KeyboardShortcut) {
    this.shortcuts.push(shortcut);
  }

  unregister(key: string) {
    this.shortcuts = this.shortcuts.filter((s) => s.key !== key);
  }

  start() {
    if (this.isListening) return;

    this.isListening = true;
    document.addEventListener("keydown", this.handleKeyDown);
  }

  stop() {
    if (!this.isListening) return;

    this.isListening = false;
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  getShortcuts() {
    return this.shortcuts;
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    const matchingShortcut = this.shortcuts.find((shortcut) => {
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;

      return keyMatch && ctrlMatch && shiftMatch && altMatch;
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  };
}

export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  if (shortcut.ctrl) parts.push("Ctrl");
  if (shortcut.shift) parts.push("Shift");
  if (shortcut.alt) parts.push("Alt");
  parts.push(shortcut.key.toUpperCase());

  return parts.join(" + ");
}

// Pre-defined shortcut combinations
export const SHORTCUTS = {
  // Navigation
  GO_HOME: { key: "h", ctrl: true, description: "Go to home" },
  GO_DASHBOARD: { key: "d", ctrl: true, description: "Go to dashboard" },

  // Actions
  NEW_BOOKING: { key: "n", ctrl: true, description: "Create new booking" },
  SEARCH: { key: "k", ctrl: true, description: "Focus search" },
  EXPORT: { key: "e", ctrl: true, description: "Export data" },
  REFRESH: { key: "r", ctrl: true, description: "Refresh data" },

  // View
  HELP: { key: "?", shift: true, description: "Show keyboard shortcuts" },
  CLOSE: { key: "Escape", description: "Close modal/dialog" },
};
