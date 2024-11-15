// src/utils/keyUtils.ts
import type { Code } from "keyboard-code-enum";
import type { FormTags, Options } from "../types";
import type { ModifierKey } from "react";

export function keyMatches(event: KeyboardEvent, keyCode: Code): boolean {
	return event.code === keyCode;
}

export function modifiersMatch(
	event: KeyboardEvent,
	modifiers: ModifierKey[],
	ignoreModifiers = false,
): boolean {
	const requiredModifiers = new Set(modifiers);
	const eventModifiers = new Set<ModifierKey>();

	if (event.ctrlKey) {
		eventModifiers.add("Control");
	}
	if (event.shiftKey) {
		eventModifiers.add("Shift");
	}
	if (event.altKey) {
		eventModifiers.add("Alt");
	}
	if (event.metaKey) {
		eventModifiers.add("Meta");
	}

	// Check that all required modifiers are present
	for (const mod of requiredModifiers) {
		if (!eventModifiers.has(mod)) {
			return false;
		}
	}

	// Ensure no extra modifiers are pressed unless ignoreModifiers is true
	if (!ignoreModifiers && eventModifiers.size !== requiredModifiers.size) {
		return false;
	}

	return true;
}

export function shouldIgnoreEvent(
	event: KeyboardEvent,
	options: Options,
): boolean {
	const target = event.target as HTMLElement;

	if (options.enableOnContentEditable === false && target.isContentEditable) {
		return true;
	}

	if (options.enableOnFormTags === false) {
		const formTags: FormTags[] = ["input", "textarea", "select"];
		if (formTags.includes(target.tagName.toLowerCase() as FormTags)) {
			return true;
		}
	}

	return false;
}
