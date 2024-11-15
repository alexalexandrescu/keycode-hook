import { Code } from "keyboard-code-enum";
import { keyMatches, modifiersMatch, shouldIgnoreEvent } from "../keyUtils";

describe("keyUtils", () => {
	describe("keyMatches", () => {
		it("should return true when keys match", () => {
			const event = new KeyboardEvent("keydown", { code: "KeyA" });
			expect(keyMatches(event, Code.KeyA)).toBe(true);
		});

		it("should return false when keys do not match", () => {
			const event = new KeyboardEvent("keydown", { code: "KeyA" });
			expect(keyMatches(event, Code.KeyB)).toBe(false);
		});
	});

	describe("modifiersMatch", () => {
		it("should return true when modifiers match", () => {
			const event = new KeyboardEvent("keydown", {
				code: "KeyA",
				ctrlKey: true,
				shiftKey: true,
			});
			Object.defineProperty(event, "code", { value: "KeyA" });

			expect(modifiersMatch(event, ["Control", "Shift"], false)).toBe(true);
		});

		it("should return false when modifiers do not match", () => {
			const event = new KeyboardEvent("keydown", {
				code: "KeyA",
				altKey: true,
			});

			expect(modifiersMatch(event, ["Control"], false)).toBe(false);
		});

		it("should ignore extra modifiers if ignoreModifiers is true", () => {
			const event = new KeyboardEvent("keydown", {
				code: "KeyA",
				ctrlKey: true,
				altKey: true,
			});

			expect(modifiersMatch(event, ["Control"], true)).toBe(true);
		});
	});

	describe("shouldIgnoreEvent", () => {
		it("should ignore event on content editable if enableOnContentEditable is false", () => {
			const event = new KeyboardEvent("keydown");
			Object.defineProperty(event, "target", {
				value: { isContentEditable: true },
			});

			expect(shouldIgnoreEvent(event, { enableOnContentEditable: false })).toBe(
				true,
			);
		});

		it("should ignore event on form tags if enableOnFormTags is false", () => {
			const event = new KeyboardEvent("keydown");
			Object.defineProperty(event, "target", {
				value: { tagName: "INPUT" },
			});

			expect(shouldIgnoreEvent(event, { enableOnFormTags: false })).toBe(true);
		});

		it("should not ignore event if conditions are not met", () => {
			const event = new KeyboardEvent("keydown");
			Object.defineProperty(event, "target", {
				value: { tagName: "DIV" },
			});

			expect(shouldIgnoreEvent(event, {})).toBe(false);
		});
	});
});
