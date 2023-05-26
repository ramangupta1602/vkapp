import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { cardStyles } from "./CardStyles";
import { inject, observer } from "mobx-react";

export const UpdateAppCardComponent = inject("userAccountStore")(
  observer(({ userAccountStore }) => {
    return (
      <View
        style={[cardStyles.card, { padding: 0 }]}
        testID={"updateAppCard"}
        accessibilityLabel={"updateAppCard"}
      >
        <Text style={[Styles.commonPadding, Styles.textStyle]}>
          An update to Viking Health is available. Would you like to update?
        </Text>

        <View style={Styles.separatorStyle} />

        <View style={Styles.buttonPanelStyle}>
          <TouchableOpacity
            testID={"notNow"}
            accessibilityLabel={"notNow"}
            activeOpacity={0.2}
            style={Styles.buttonStyle}
            onPress={() => {
              userAccountStore.setShowUpdateAvailableCard(false);
            }}
          >
            <Text style={[Styles.textStyle, Styles.buttonTextStyle]}>
              Not Now
            </Text>
          </TouchableOpacity>

          <View style={Styles.verticalSeparatorStyle} />

          <TouchableOpacity
            testID={"goToStore"}
            accessibilityLabel={"goToStore"}
            activeOpacity={0.2}
            style={Styles.buttonStyle}
            onPress={() => {
              userAccountStore.setShowUpdateAvailableCard(false);
              goToStore();
            }}
          >
            <Text
              style={[
                Styles.textStyle,
                Styles.buttonTextStyle,
                { color: "#024481" },
              ]}
            >
              Go To Store
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  })
);

const goToStore = () => {
  if (Platform.OS === "ios") {
    Linking.openURL("https://apps.apple.com/us/app/viking-health/id1456404647");
  } else {
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.vikinghealth&hl=en"
    );
  }
};

const Styles = StyleSheet.create({
  commonPadding: {
    paddingLeft: 16,
    paddingTop: 16,
    paddingRight: 16,
  },

  textStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "grey",
  },

  buttonTextStyle: {
    fontWeight: "500",
  },

  separatorStyle: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginTop: 10,
  },

  verticalSeparatorStyle: {
    width: StyleSheet.hairlineWidth,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  buttonPanelStyle: {
    flexDirection: "row",
  },
  buttonStyle: {
    flex: 1,
    padding: 5,
    paddingVertical: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
