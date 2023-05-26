import React from "react";

export const BottomBarContext = React.createContext({
  showBottomBar: () => {},
  hideBottomBar: () => {},
});

export const BottomBarProvider = BottomBarContext.Provider;
export const BottomBarConsumer = BottomBarContext.Consumer;
