import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { ModifierKey } from "react";
import { useHotkeys } from "../useHotkeys";

import { Code } from "keyboard-code-enum";
import { ScopeProvider, useScope } from "../../context/ScopeContext";

describe("useHotkeys", () => {
	it("should trigger callback when hotkey is pressed", () => {
		const callback = jest.fn();

		const wrapper = ({ children }: { children: ReactNode }) => (
			<ScopeProvider>{children}</ScopeProvider>
		);

		renderHook(() => useHotkeys({ key: Code.KeyA }, callback), { wrapper });

		act(() => {
			const event = new KeyboardEvent("keydown", { code: "KeyA" });
			document.dispatchEvent(event);
		});

		expect(callback).toHaveBeenCalled();
	});

	it("should not trigger callback when different key is pressed", () => {
		const callback = jest.fn();

		const wrapper = ({ children }: { children: ReactNode }) => (
			<ScopeProvider>{children}</ScopeProvider>
		);

		renderHook(() => useHotkeys({ key: Code.KeyA }, callback), { wrapper });

		act(() => {
			const event = new KeyboardEvent("keydown", { code: "KeyB" });
			document.dispatchEvent(event);
		});

		expect(callback).not.toHaveBeenCalled();
	});

	it("should respect modifier keys", () => {
		const callback = jest.fn();

		const wrapper = ({ children }: { children: ReactNode }) => (
			<ScopeProvider>{children}</ScopeProvider>
		);

		renderHook(
			() => useHotkeys({ key: Code.KeyA, modifiers: ["Control"] }, callback),
			{
				wrapper,
			},
		);

		act(() => {
			const event = new KeyboardEvent("keydown", {
				code: "KeyA",
				ctrlKey: true,
				key: "a",
			});
			document.dispatchEvent(event);
		});

		expect(callback).toHaveBeenCalled();
	});

	it("should not trigger callback if modifiers do not match", () => {
		const callback = jest.fn();

		const wrapper = ({ children }: { children: ReactNode }) => (
			<ScopeProvider>{children}</ScopeProvider>
		);

		renderHook(
			() => useHotkeys({ key: Code.KeyA, modifiers: ["Control"] }, callback),
			{
				wrapper,
			},
		);

		act(() => {
			const event = new KeyboardEvent("keydown", {
				code: "KeyA",
				shiftKey: true,
				key: "a",
			});
			document.dispatchEvent(event);
		});

		expect(callback).not.toHaveBeenCalled();
	});

	it("should prevent default behavior if preventDefault is true", () => {
		const callback = jest.fn();
		const preventDefault = jest.fn();

		const wrapper = ({ children }: { children: ReactNode }) => (
			<ScopeProvider>{children}</ScopeProvider>
		);

		renderHook(
			() =>
				useHotkeys({ key: Code.KeyA }, callback, { preventDefault: true }, []),
			{ wrapper },
		);

		act(() => {
			const event = new KeyboardEvent("keydown", {
				code: "KeyA",
			});
			Object.defineProperty(event, "preventDefault", { value: preventDefault });
			document.dispatchEvent(event);
		});

		expect(preventDefault).toHaveBeenCalled();
	});

	it("should only trigger in correct scope", () => {
		const callback = jest.fn();

		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<ScopeProvider>{children}</ScopeProvider>
		);

		const { result } = renderHook(
			() => {
				const { pushScope } = useScope();
				useHotkeys({ key: Code.KeyA, scopes: ["test-scope"] }, callback);
				return { pushScope };
			},
			{ wrapper },
		);

		// Not in scope
		act(() => {
			const event = new KeyboardEvent("keydown", { code: "KeyA" });
			document.dispatchEvent(event);
		});

		expect(callback).not.toHaveBeenCalled();

		// Enter scope
		act(() => {
			result.current.pushScope("test-scope");
		});

		// In scope
		act(() => {
			const event = new KeyboardEvent("keydown", { code: "KeyA" });
			document.dispatchEvent(event);
		});

		expect(callback).toHaveBeenCalled();
	});

	it("should handle multiple hotkeys", () => {
		const callback = jest.fn();

		const wrapper = ({ children }: { children: ReactNode }) => (
			<ScopeProvider>{children}</ScopeProvider>
		);

		renderHook(
			() =>
				useHotkeys(
					[{ key: Code.KeyA }, { key: Code.KeyB, modifiers: ["Control"] }],
					callback,
				),
			{
				wrapper,
			},
		);

		act(() => {
			const eventA = new KeyboardEvent("keydown", { code: "KeyA" });
			document.dispatchEvent(eventA);
		});

		act(() => {
			const eventB = new KeyboardEvent("keydown", {
				code: "KeyB",
				ctrlKey: true,
			});
			document.dispatchEvent(eventB);
		});

		expect(callback).toHaveBeenCalledTimes(2);
	});
});
