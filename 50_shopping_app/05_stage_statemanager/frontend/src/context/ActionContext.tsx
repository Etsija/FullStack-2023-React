import React from "react";

export interface DispatchInterface {
    dispatch: React.Dispatch<any>;
}

const ActionContext = React.createContext<DispatchInterface>({
    dispatch: () => {}
});

ActionContext.displayName = "ActionContext";

export default ActionContext;