// src/hooks/useRecordHotkey.ts
import { useEffect, useState, type ModifierKey } from "react";
import type { Code } from "keyboard-code-enum";
import type { Hotkey } from "../types";

export function useRecordHotkey(): {
	isRecording: boolean;
	recordedHotkey: Hotkey | null;
	startRecording: () => void;
	stopRecording: () => void;
	resetRecording: () => void;
} {
	const [isRecording, setIsRecording] = useState(false);
	const [recordedHotkey, setRecordedHotkey] = useState<Hotkey | null>(null);

	useEffect(() => {
		if (!isRecording) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			event.preventDefault();

			const modifiers: ModifierKey[] = [];
			if (event.shiftKey) {
				modifiers.push("Shift");
			}
			if (event.ctrlKey) {
				modifiers.push("Control");
			}
			if (event.altKey) {
				modifiers.push("Alt");
			}
			if (event.metaKey) {
				modifiers.push("Meta");
			}

			// Ignore modifier-only key presses
			const modifierCodes = new Set([
				"ShiftLeft",
				"ShiftRight",
				"ControlLeft",
				"ControlRight",
				"AltLeft",
				"AltRight",
				"MetaLeft",
				"MetaRight",
			]);

			if (modifierCodes.has(event.code)) {
				// Modifier-only key press; ignore
				return;
			}

			const hotkey: Hotkey = {
				key: event.code as Code,
				modifiers: modifiers.length > 0 ? modifiers : undefined,
			};

			setRecordedHotkey(hotkey);
			setIsRecording(false);
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isRecording]);

	const startRecording = () => {
		setRecordedHotkey(null);
		setIsRecording(true);
	};

	const stopRecording = () => {
		setIsRecording(false);
	};

	const resetRecording = () => {
		setRecordedHotkey(null);
	};

	return {
		isRecording,
		recordedHotkey,
		startRecording,
		stopRecording,
		resetRecording,
	};
}
