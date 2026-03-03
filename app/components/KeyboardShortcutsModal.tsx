"use client";

import { formatShortcut, KeyboardShortcut } from "../utils/keyboard";

interface KeyboardShortcutsModalProps {
  shortcuts: KeyboardShortcut[];
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ shortcuts, onClose }: KeyboardShortcutsModalProps) {
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.description.includes("Go to") ? "Navigation" :
                    shortcut.description.includes("Create") || shortcut.description.includes("Export") || shortcut.description.includes("Refresh") ? "Actions" :
                    "General";

    if (!acc[category]) acc[category] = [];
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">⌨️ Keyboard Shortcuts</h2>
              <p className="text-purple-100 text-sm">Speed up your workflow with these shortcuts</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{category}</h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all"
                  >
                    <span className="text-gray-700">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {formatShortcut(shortcut).split(" + ").map((key, i, arr) => (
                        <span key={i}>
                          <kbd className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 shadow-sm">
                            {key}
                          </kbd>
                          {i < arr.length - 1 && <span className="text-gray-400 mx-1">+</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-3xl border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            💡 Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-semibold">Shift</kbd> + <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-semibold">?</kbd> anytime to view this help
          </p>
        </div>
      </div>
    </div>
  );
}
