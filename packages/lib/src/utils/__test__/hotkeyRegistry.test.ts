import { Code } from "keyboard-code-enum";
import type { Hotkey } from "../../types";
import {
	hotkeyRegistry,
	registerHotkey,
	unregisterHotkey,
} from "../hotkeyRegistry";

describe("hotkeyRegistry", () => {
	beforeEach(() => {
		hotkeyRegistry.clear();
	});

	it("should register a hotkey", () => {
		const hotkey: Hotkey = { key: Code.KeyA, scopes: ["test-scope"] };

		registerHotkey(hotkey);

		expect(hotkeyRegistry.size).toBe(1);
		const keyCombo = `${hotkey.key}`;
		expect(hotkeyRegistry.get(keyCombo)?.has("test-scope")).toBe(true);
	});

	it("should detect conflicts", () => {
		console.warn = jest.fn();

		const hotkey1: Hotkey = { key: Code.KeyA, scopes: ["test-scope"] };
		const hotkey2: Hotkey = { key: Code.KeyA, scopes: ["test-scope"] };

		registerHotkey(hotkey1);
		registerHotkey(hotkey2);

		expect(console.warn).toHaveBeenCalledWith(
			`Hotkey conflict detected for key combination "${hotkey1.key}" in scope "test-scope"`,
		);
	});

	it("should unregister a hotkey", () => {
		const hotkey: Hotkey = { key: Code.KeyA, scopes: ["test-scope"] };

		registerHotkey(hotkey);
		expect(hotkeyRegistry.size).toBe(1);

		unregisterHotkey(hotkey);
		expect(hotkeyRegistry.size).toBe(0);
	});
});
