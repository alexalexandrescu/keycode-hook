import React, {type FC, type PropsWithChildren, useEffect} from "react";
import {useScope} from "./ScopeContext";

interface ScopeBoundaryProps {
    scope: string;
}

export const ScopeBoundary: FC<PropsWithChildren<ScopeBoundaryProps>> = ({ scope, children }) => {
    const { pushScope, popScope } = useScope();

    useEffect(() => {
        pushScope(scope);
        return () => {
            popScope(scope);
        };
    }, [scope, pushScope, popScope]);

    return <>{children}</>;
};
