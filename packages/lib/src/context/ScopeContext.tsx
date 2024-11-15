// src/context/ScopeContext.tsx
import React, {createContext, type FC, type ReactNode, useCallback, useContext, useState,} from "react";

interface ScopeContextType {
	currentScopes: Set<string>;
	pushScope: (scope: string) => void;
	popScope: (scope: string) => void;
}

const ScopeContext = createContext<ScopeContextType | undefined>(undefined);

export const useScope = (): ScopeContextType => {
	const context = useContext(ScopeContext);
	if (!context) {
		throw new Error("useScope must be used within a ScopeProvider");
	}
	return context;
};

interface ScopeProviderProps {
	children: ReactNode;
}

export const ScopeProvider: FC<ScopeProviderProps> = ({ children }) => {
	const [scopeStack, setScopeStack] = useState<Set<string>>(new Set());

	const pushScope = useCallback((scope: string) => {
		setScopeStack((prev) => new Set(prev).add(scope));
	}, []);

	const popScope = useCallback((scope: string) => {
		setScopeStack((prev) => {
			const newStack = new Set(prev);
			newStack.delete(scope);
			return newStack;
		});
	}, []);

	const currentScopes = scopeStack; // Now directly using the Set

	return (
		<ScopeContext.Provider value={{ currentScopes, pushScope, popScope }}>
			{children}
		</ScopeContext.Provider>
	);
};
