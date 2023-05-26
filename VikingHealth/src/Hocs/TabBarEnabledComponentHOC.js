import React, { Component } from "react";
import { BottomBarContext } from "../Context/BottomTabContext";
import { withNavigation } from "react-navigation";

export function tabBarEnabledComponentHOC(WrappedComponent, selectedTab) {
  const TabEnabledComponent = class extends Component {
    static navigationOptions = {
      header: null,
    };

    static contextType = BottomBarContext;

    constructor(props) {
      super(props);

      this.focusListener = this.props.navigation.addListener(
        "willFocus",
        () => {
          this.context.showBottomBar();
          this.context.setSelectedTab(selectedTab);
        }
      );

      this.didFocusListener = this.props.navigation.addListener(
        "didFocus",
        () => {
          this.context.checkForReward(true);
        }
      );
    }

    componentWillUnmount() {
      this.didFocusListener.remove();
      this.focusListener.remove();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return withNavigation(TabEnabledComponent);
}
