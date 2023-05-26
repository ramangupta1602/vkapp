import React, { Component } from "react";
import { BottomBarContext } from "../Context/BottomTabContext";
import { withNavigation } from "react-navigation";

export function tabBarDisabledComponentHOC(WrappedComponent) {
  const TabDisabledComponent = class extends Component {
    static navigationOptions = {
      header: null,
    };

    static contextType = BottomBarContext;

    constructor(props) {
      super(props);

      this.focusListener = this.props.navigation.addListener(
        "willFocus",
        () => {
          this.context.hideBottomBar();
          this.context.checkForReward(false);
        }
      );
    }

    componentWillUnmount() {
      this.focusListener.remove();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return withNavigation(TabDisabledComponent);
}
