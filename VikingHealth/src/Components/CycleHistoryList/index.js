import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import Style from "./styles";
import { strings } from "../../utility/locales/i18n";
import Chips from "./chips";
import { inject, observer } from "mobx-react";

const ALL_CYCLE_INDEX = -1;

@inject("userAccountStore")
@observer
export class CycleHistoryList extends Component {
  constructor(props) {
    super(props);

    this.cycleHistory = this.props.userAccountStore.cycleHistoryData;
    const {
      lastAcceptedCycle,
      startDate,
      programEndDate,
    } = this.props.userAccountStore;

    // hideCurrent flag is used by summary screen because normally we don't want to show current cycle
    // but for the other listing like logging screen, inches loss, we want to show it..
    if (!props.hideCurrent) {
      // pushing dates for the current cycle.. because history only contain past cycle data..
      this.cycleHistory.push({ startDate, endDate: programEndDate });
    }

    const historyLength = this.cycleHistory ? this.cycleHistory.length : 0;

    this.state = {
      currentSelection: historyLength - 1,
      currentCycle: lastAcceptedCycle,
    };
  }

  componentDidMount = () => {
    if (this.scrollViewRef) {
      setTimeout(() => {
        if (this.scrollViewRef) this.scrollViewRef.scrollToEnd();
      }, 50);
    }
  };

  onChipSelected = (index) => {
    if (this.props.onChipSelected) {
      const data = this.cycleHistory[index];
      const isCurrentCycle = this.cycleHistory.length - 1 === index;
      const isAllSelected = ALL_CYCLE_INDEX === index;
      const { shouldShowAllSelected } = this.props;

      if (isAllSelected) {
        this.props.onChipSelected({
          index,
          startDate: "",
          endDate: "",
          isCurrentCycle,
          isAllSelected,
        });

        if (shouldShowAllSelected) {
          this.setState({
            currentSelection: index,
          });
        }
      } else {
        const { startDate, endDate } = data;
        this.props.onChipSelected({
          index,
          startDate,
          endDate,
          isCurrentCycle,
          isAllSelected,
        });

        this.setState({
          currentSelection: index,
        });
      }
    }
  };

  render() {
    // If currentCycle (LastAccepted cycle) is null, then we don't want to show this bar
    if (!(this.state.currentCycle > 1)) {
      return null;
    }

    const {
      hideTitle,
      hideAll,
      borderColor,
      selectedColor,
      selectedTextColor,
      dataContainerStyle,
      unselectedColor,
      unSelectedTextColor,
    } = this.props;

    return (
      <View style={Style.containerStyle}>
        {!hideTitle && (
          <Text style={Style.textStyle}>
            {strings("weight_details.reload_cycle")}
          </Text>
        )}

        {this.cycleHistory && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={(ref) => {
              this.scrollViewRef = ref;
            }}
          >
            <View
              style={[Style.listStyle]}
              testID="cycleHistoryList"
              accessibilityLabel={"cycleHistoryList"}
            >
              {this.cycleHistory.map((item, index) => {
                return (
                  <Chips
                    key={index + 1}
                    label={`Cycle ${index + 1}`}
                    index={index}
                    selectedColor={selectedColor}
                    borderColor={borderColor}
                    onChipSelected={this.onChipSelected}
                    selectedTextColor={selectedTextColor}
                    unselectedColor={unselectedColor}
                    unSelectedTextColor={unSelectedTextColor}
                    isSelected={index === this.state.currentSelection}
                  />
                );
              })}

              {!hideAll && (
                <Chips
                  label="All"
                  style={{ paddingHorizontal: 24 }}
                  index={ALL_CYCLE_INDEX}
                  selectedColor={selectedColor}
                  onChipSelected={this.onChipSelected}
                  isSelected={this.state.currentSelection === ALL_CYCLE_INDEX}
                  selectedTextColor={selectedTextColor}
                  unselectedColor={unselectedColor}
                  unSelectedTextColor={unSelectedTextColor}
                />
              )}
            </View>
          </ScrollView>
        )}

        {dataContainerStyle && <View style={Style.separatorStyle} />}
      </View>
    );
  }
}
