import { act, renderHook } from "@testing-library/react";
import { ScopeProvider, useScope } from "../ScopeContext";

describe("ScopeContext", () => {
	it("should provide scope functions", () => {
		const { result } = renderHook(() => useScope(), {
			wrapper: ScopeProvider,
		});

		expect(result.current.currentScopes).toEqual(new Set());

		act(() => {
			result.current.pushScope("test-scope");
		});

		expect(result.current.currentScopes).toEqual(new Set(["test-scope"]));

		act(() => {
			result.current.popScope();
		});

		expect(result.current.currentScopes).toEqual(new Set());
	});

	it("should manage nested scopes", () => {
		const { result } = renderHook(() => useScope(), {
			wrapper: ScopeProvider,
		});

		act(() => {
			result.current.pushScope("scope1");
		});

		act(() => {
			result.current.pushScope("scope2");
		});

		expect(result.current.currentScopes).toEqual(new Set(["scope1", "scope2"]));

		act(() => {
			result.current.popScope();
		});

		expect(result.current.currentScopes).toEqual(new Set(["scope1"]));
	});
});
