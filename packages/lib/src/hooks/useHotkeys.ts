// src/hooks/useHotkeys.ts
import {type MutableRefObject, useEffect, useRef} from "react";
import {useScope} from "../context/ScopeContext";
import type {Hotkey, Options} from "../types";
import {registerHotkey, unregisterHotkey} from "../utils/hotkeyRegistry";
import {keyMatches, modifiersMatch, shouldIgnoreEvent,} from "../utils/keyUtils";

export function useHotkeys<T extends Element>(
	hotkeys: Hotkey | Hotkey[],
	callback?: (event: KeyboardEvent, hotkey: Hotkey) => void,
	options: Options = {},
	deps: unknown[] = [],
): MutableRefObject<T | null> {
	const targetRef = useRef<T | null>(null);
	const { currentScopes } = useScope();

	useEffect(() => {
		const hotkeyList = Array.isArray(hotkeys) ? hotkeys : [hotkeys];
		const enabledOption =
			options.enabled !== undefined ? options.enabled : true;

		// Register hotkeys for conflict detection
		for (const hotkey of hotkeyList) {
			registerHotkey(hotkey);
		}

		const handler = (event: KeyboardEvent) => {
			const isEnabled =
				typeof enabledOption === "boolean"
					? enabledOption
					: enabledOption(event);

			if (!isEnabled) return;

			if (shouldIgnoreEvent(event, options)) {
				return;
			}

			for (const hotkey of hotkeyList) {
				if (!keyMatches(event, hotkey.key)) {
					continue;
				}

				if (
					!modifiersMatch(
						event,
						hotkey.modifiers || [],
						options.ignoreModifiers,
					)
				) {
					continue;
				}

				if (!scopesMatch(hotkey.scopes, currentScopes)) {
					continue;
				}

				if (options.preventDefault) {
					event.preventDefault();
				}

				// Use the callback from the hotkey object if provided
				if (hotkey.callback) {
					hotkey.callback(event);
				} else if (callback) {
					callback(event, hotkey);
				}
				break;
			}
		};

		const targetElement = options.document || document;

		if (options.keydown !== false) {
			targetElement.addEventListener("keydown", handler);
		}

		if (options.keyup) {
			targetElement.addEventListener("keyup", handler);
		}

		return () => {
			if (options.keydown !== false) {
				targetElement.removeEventListener("keydown", handler);
			}
			if (options.keyup) {
				targetElement.removeEventListener("keyup", handler);
			}

			// Unregister hotkeys
			for (const hotkey of hotkeyList) {
				unregisterHotkey(hotkey);
			}
		};
	}, [hotkeys, callback, options, ...deps, currentScopes]);

	return targetRef;
}

function scopesMatch(
	hotkeyScopes: string[] | undefined,
	currentScopes: Set<string>,
): boolean {
	if (!hotkeyScopes || hotkeyScopes.length === 0) {
		// Hotkey is global
		return true;
	}
	for (const scope of hotkeyScopes) {
		if (currentScopes.has(scope)) {
			return true;
		}
	}
	return false;
}
