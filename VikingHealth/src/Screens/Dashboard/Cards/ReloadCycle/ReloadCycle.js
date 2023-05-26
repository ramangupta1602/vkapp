import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import Style from "./styles";
import { strings } from "../../../../utility/locales/i18n";
import { R } from "../../../../Resources";
import { inject, observer } from "mobx-react";

@observer
@inject("userAccountStore", "loginUserStore", "gamificationStore")
class ReloadCycle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[Style.containerStyle]}
        testID={"reloadCycle"}
        accessibilityLabel={"reloadCycle"}
      >
        <View
          style={[
            {
              position: "absolute",
              left: 8,
              top: 0,
              right: 0,
              bottom: 0,
              borderRadius: 10,
              overflow: "hidden",
            },
          ]}
        >
          <Image
            style={{ width: "100%", height: "100%" }}
            source={R.Images.ReloadDashboardCardBG}
            resizeMode="cover"
          />
        </View>

        <Text style={Style.continueText}>
          {strings("reload_screen.continue")}
        </Text>

        <Text style={Style.now_active_style}>
          {strings("reload_screen.now_active")}
        </Text>

        <Text style={Style.reloadTextStyle}>
          {strings("reload_screen.reload_cycle")}
        </Text>

        <TouchableOpacity
          testID={"startReload"}
          accessibilityLabel={"startReload"}
          style={Style.startButtonStyle}
          onPress={this.props.onClick}
        >
          <Text style={Style.startTextStyle}>
            {strings("reload_screen.start")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(ReloadCycle);
