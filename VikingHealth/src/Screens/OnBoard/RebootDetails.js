import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { strings } from "../../utility/locales/i18n";
import { R } from "Resources";
import { CrossButton, PageTitle, SubTitle, PageInfo } from "Components";
import { PhaseComponent } from "./PhaseComponent";

export class RebootDetails extends Component {
  onCrossClicked() {
    if (this.props.onCrossClicked) {
      this.props.onCrossClicked();
    }
  }

  render() {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: R.Colors.COLOR_APP_BACKGROUND }}>
        <View style={styles.container}>
          <View
            style={{
              marginBottom: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}>
            <CrossButton onCrossClicked={() => this.onCrossClicked()} />
            <PageInfo info={strings("onboard.weight_loss_program")} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <PageTitle title={strings("onboard.reboot")} />
          </View>
          <View style={{ marginRight: 40 }}>
            <SubTitle
              subTitle={strings("onboard_details.view_details_description")}
            />
          </View>
          <Text style={styles.title}>{strings("onboard_details.title")}</Text>
          <View style={{ marginLeft: 8, marginRight: 16, marginTop: 4 }}>
            <PhaseComponent
              phaseText="Loading Phase"
              descText={strings("onboard_details.phase1_desc")}
              backgroundColor="#9ED0F480"
              textColor="#3AA5F6"
            />
            <PhaseComponent
              phaseText="Losing Phase"
              descText={strings("onboard_details.phase2_desc")}
              backgroundColor="#DEB9F580"
              textColor="#C964F9"
            />
            <PhaseComponent
              phaseText="Reset Phase"
              descText={strings("onboard_details.phase3_desc")}
              backgroundColor="#CDECD880"
              textColor="#43D35C"
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: "flex-start",
    flex: 1,
    marginTop: 40,
    paddingBottom: 40,
    marginLeft: 8,
  },
  title: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 20,
    textAlign: "left",
    marginRight: 40,
    marginLeft: 8,
  },
});
