import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import Style from "./styles";
import WeightJourneyComponent from "./WeightJourneyComponent";
import BodyMeasurementSummary from "./BodyMeasurementSummary/BodyMeasurementSummary";
import { R } from "../../Resources/R";
import { BackButton, PageTitle } from "../../Components";
import { inject, observer } from "mobx-react";
import { MeasurementList } from "../../Screens/BodyMeasurementsDetails/MeasurementList";
import { HeightWeightUtil } from "../../Library/Utils/HeightWeightUtil";
import { USER_TYPE } from "Library/Constants";

import { BottomBarConstant } from "../../Components/Tabbar/BottomTabBar";
import { BottomBarContext } from "../../Context/BottomTabContext";

@observer
@inject("userAccountStore", "loginUserStore", "gamificationStore")
export class SummaryScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  static contextType = BottomBarContext;

  constructor(props) {
    super(props);

    const isShowInchLoss = props.navigation.getParam("showInchLoss", false);
    const selectedIndex = isShowInchLoss ? 1 : 0;

    this.tabs = ["Weight Lost", "Inches Lost"];
    this.state = {
      selectedIndex,
    };
  }

  componentDidMount() {
    this.context.setSelectedTab(BottomBarConstant.JourneyTab);
  }

  tabSelectionChange = (index) => {
    this.setState({
      selectedIndex: index,
    });
  };

  scrollToEnd = () => {
    if (this.scrollRef) {
      this.scrollRef.scrollToEnd();
    }
  };

  scrollToTop = () => {
    if (this.scrollRef) {
      this.scrollRef.scrollTo({ x: 0, y: 0 });
    }
  };

  scrollTo = (position) => {
    if (this.scrollRef) {
      this.scrollRef.scrollTo(position);
    }
  };

  toggleScrolling = (canScroll) => {
    if (this.scrollRef) {
      this.scrollRef.setNativeProps({ scrollEnabled: canScroll });
      this.scrollRef.flashScrollIndicators();
    }
  };

  render() {
    const userId = this.props.userAccountStore.username;
    const weightUnit = this.props.loginUserStore.displayWeightUnit;
    const weightUnitText = HeightWeightUtil.weightUnit(weightUnit);
    const {
      programStartDate,
      programEndDate,
      heightUnit,
    } = this.props.userAccountStore;

    const firstName = this.props.userAccountStore.firstName.substring(0, 15);
    const isPatient = this.props.loginUserStore.userType == USER_TYPE.PATIENT;

    let text = "";

    if (isPatient) {
      text = "My Journey";
    } else {
      text = `${firstName}'s Journey`;
    }

    return (
      <ScrollView
        ref={(ref) => {
          this.scrollRef = ref;
        }}
        style={Style.scrollViewStyle}
      >
        <View style={Style.containerStyle}>
          {/* This is our tab ui and rest is our svg... It's height is 200px */}
          <View>
            {/* Title Bar */}
            <View>
              <View style={{ paddingTop: 40 }}>
                <BackButton
                  navigation={this.props.navigation}
                  style={{
                    paddingBottom: 0,
                    paddingLeft: 0,
                    marginBottom: 0,
                  }}
                  backButtonStyle={{
                    paddingBottom: 16,
                  }}
                  imageStyle={{
                    paddingBottom: 0,
                    marginBottom: 0,
                  }}
                />

                <View style={[Style.headerContainer, { marginTop: 20 }]}>
                  <PageTitle title={text} style={{ marginLeft: 0 }} />
                </View>
              </View>
            </View>

            {/* Tab Bar */}
            <View>
              <ScrollView
                style={{ marginTop: 30, height: 30 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate={0}
                snapToInterval={200}
                snapToAlignment={"center"}
              >
                {this.tabs.map((value, index) => (
                  <MeasurementList
                    key={value}
                    onClick={this.tabSelectionChange}
                    text={value}
                    indexValue={index}
                    isSelected={this.state.selectedIndex === index}
                  />
                ))}
              </ScrollView>
            </View>
          </View>

          <SummaryScreenComponent
            index={this.state.selectedIndex}
            userId={userId}
            programEndDate={programEndDate}
            programStartDate={programStartDate}
            weightUnit={weightUnit}
            measurementUnit={heightUnit}
            weightUnitText={weightUnitText}
            scrollToEnd={this.scrollToEnd}
            scrollToTop={this.scrollToTop}
            scrollTo={this.scrollTo}
            toggleScrolling={this.toggleScrolling}
            firstName={firstName}
            isPatient={isPatient}
          />
        </View>
      </ScrollView>
    );
  }
}

const SummaryScreenComponent = ({
  index,
  userId,
  programStartDate,
  programEndDate,
  weightUnit,
  measurementUnit,
  weightUnitText,
  scrollToEnd,
  scrollToTop,
  scrollTo,
  toggleScrolling,
  firstName,
  isPatient,
}) => {
  if (index === 0) {
    return (
      <WeightJourneyComponent
        userId={userId}
        programStartDate={programStartDate}
        programEndDate={programEndDate}
        weightUnit={weightUnit}
        weightUnitText={weightUnitText}
        scrollToEnd={scrollToEnd}
        scrollToTop={scrollToTop}
        scrollTo={scrollTo}
        toggleScrolling={toggleScrolling}
      />
    );
  }
  return (
    <BodyMeasurementSummary
      userId={userId}
      programStartDate={programStartDate}
      programEndDate={programEndDate}
      measurementUnit={measurementUnit}
      scrollToEnd={scrollToEnd}
      scrollToTop={scrollToTop}
      toggleScrolling={toggleScrolling}
      firstName={firstName}
      isPatient={isPatient}
    />
  );
};

export default SummaryScreen;
