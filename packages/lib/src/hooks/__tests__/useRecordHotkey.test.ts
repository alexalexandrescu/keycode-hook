import { act, renderHook } from "@testing-library/react";
import { Code } from "keyboard-code-enum";
import { useRecordHotkey } from "../useRecordHotkey";

describe("useRecordHotkey", () => {
	it("should start and stop recording", () => {
		const { result } = renderHook(() => useRecordHotkey());

		expect(result.current.isRecording).toBe(false);

		act(() => {
			result.current.startRecording();
		});

		expect(result.current.isRecording).toBe(true);

		act(() => {
			result.current.stopRecording();
		});

		expect(result.current.isRecording).toBe(false);
	});

	it("should record a hotkey", () => {
		const { result } = renderHook(() => useRecordHotkey());

		act(() => {
			result.current.startRecording();
		});

		act(() => {
			const event = new KeyboardEvent("keydown", { code: "KeyA" });
			window.dispatchEvent(event);
		});

		expect(result.current.recordedHotkey).toEqual({
			key: Code.KeyA,
			modifiers: undefined,
		});
		expect(result.current.isRecording).toBe(false);
	});

	it("should record modifiers", () => {
		const { result } = renderHook(() => useRecordHotkey());

		act(() => {
			result.current.startRecording();
		});

		act(() => {
			const event = new KeyboardEvent("keydown", {
				code: "KeyA",
				ctrlKey: true,
			});
			window.dispatchEvent(event);
		});

		expect(result.current.recordedHotkey).toEqual({
			key: Code.KeyA,
			modifiers: ["Control"],
		});
	});

	it("should ignore modifier-only keys", () => {
		const { result } = renderHook(() => useRecordHotkey());

		act(() => {
			result.current.startRecording();
		});

		act(() => {
			const event = new KeyboardEvent("keydown", {
				code: "ControlLeft",
				ctrlKey: true,
			});
			window.dispatchEvent(event);
		});

		expect(result.current.recordedHotkey).toBeNull();
		expect(result.current.isRecording).toBe(true);
	});

	it("should reset recording", () => {
		const { result } = renderHook(() => useRecordHotkey());

		act(() => {
			result.current.startRecording();
		});

		act(() => {
			const event = new KeyboardEvent("keydown", { code: "KeyA" });
			window.dispatchEvent(event);
		});

		expect(result.current.recordedHotkey).not.toBeNull();

		act(() => {
			result.current.resetRecording();
		});

		expect(result.current.recordedHotkey).toBeNull();
	});
});
