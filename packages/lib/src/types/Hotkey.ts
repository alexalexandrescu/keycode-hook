// src/types/Hotkey.ts
import type { Code } from "keyboard-code-enum";
import type { ModifierKey } from "react";

export interface Hotkey {
	key: Code;
	modifiers?: ModifierKey[];
	scopes?: string[];
	callback?: (event: KeyboardEvent) => void;
}
