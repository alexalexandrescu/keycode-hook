// src/utils/hotkeyRegistry.ts
import type { Hotkey } from "../types";

export const hotkeyRegistry = new Map<string, Set<string>>(); // Key combination to scopes

export function hotkeyKeyCombination(hotkey: Hotkey): string {
	const modifierCodes = (hotkey.modifiers || []).sort().join("+");
	return modifierCodes ? `${modifierCodes}+${hotkey.key}` : `${hotkey.key}`;
}

export function registerHotkey(hotkey: Hotkey) {
	const keyCombo = hotkeyKeyCombination(hotkey);
	const scopes = hotkey.scopes || ["global"];
	const existingScopes = hotkeyRegistry.get(keyCombo) || new Set();

	for (const scope of scopes) {
		if (existingScopes.has(scope)) {
			console.warn(
				`Hotkey conflict detected for key combination "${keyCombo}" in scope "${scope}"`,
			);
		} else {
			existingScopes.add(scope);
		}
	}

	hotkeyRegistry.set(keyCombo, existingScopes);
}

export function unregisterHotkey(hotkey: Hotkey) {
	const keyCombo = hotkeyKeyCombination(hotkey);
	const scopes = hotkey.scopes || ["global"];
	const existingScopes = hotkeyRegistry.get(keyCombo);

	if (existingScopes) {
		for (const scope of scopes) {
			existingScopes.delete(scope);
		}
		if (existingScopes.size === 0) {
			hotkeyRegistry.delete(keyCombo);
		} else {
			hotkeyRegistry.set(keyCombo, existingScopes);
		}
	}
}
