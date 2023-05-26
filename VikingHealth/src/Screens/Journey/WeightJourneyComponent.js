import React, { Component } from "react";
import { View } from "react-native";
import { Query } from "react-apollo";
import { inject, observer } from "mobx-react";
import * as WeightLogQueries from "AppSyncQueries/WeightLogQueries";
import { CycleHistoryList } from "../../Components";
import { HeightWeightUtil } from "../../Library/Utils/HeightWeightUtil";
import SummarySvg from "./SummarySvg";

@observer
@inject("userAccountStore", "loginUserStore", "gamificationStore")
export default class WeightJourneyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCycleStartDate: null,
      currentCycleEndDate: null,
      isAllSelected: false,
      reRunProgressAnimation: true,
    };
  }

  /**
   * Handles user selection for -
   * cycle start/end data,
   * whether isAllSelected.
   * And, re-renders SummarySvg component once user selects any cycle
   */
  handleCycleHistoryData = (data) => {
    const { startDate, endDate, isAllSelected } = data;
    const { programStartDate, programEndDate } = this.props.userAccountStore;
    this.setState({
      currentCycleStartDate: isAllSelected ? programStartDate : startDate,
      currentCycleEndDate: isAllSelected ? programEndDate : endDate,
      isAllSelected: isAllSelected,
      /**
       * as soon as user selects any cycle,
       * we unmount the SummarySvg component,
       * to refresh existing progress & data/state variables.
       */
      reRunProgressAnimation: false,
    });
    /**
     * And mount it again after unmounting it from above.
     * This is done, so that our scope/state, animation variables gets reset at unmouting.
     */
    setTimeout(() => {
      this.setState({ reRunProgressAnimation: true });
    }, 0);
  };

  /**
   * Get program date according to the user cycle selection
   * cycleStart/EndDate contains date of the present cycle if running,
   * otherwise programStart/EndDate
   */
  getCycleDate = () => {
    const { startDate, programEndDate } = this.props.userAccountStore;
    let cycleStartDate = this.state.currentCycleStartDate || startDate;
    let cycleEndDate = this.state.currentCycleEndDate || programEndDate;
    return { cycleStartDate, cycleEndDate };
  };

  render() {
    const {
      userId,
      weightUnit,
      weightUnitText,
      scrollToEnd,
      scrollToTop,
      scrollTo,
      toggleScrolling,
      programStartDate,
    } = this.props;

    const { isAllSelected } = this.state;
    /**
     * If current cycle is running -
     * get cycle start/end date
     * otherwise get program start/end date
     */
    const { cycleStartDate, cycleEndDate } = this.getCycleDate();
    return (
      <View style={{ justifyContent: "center", flex: 1 }}>
        <Query
          query={WeightLogQueries.GetWeightLogs}
          variables={{
            userId,
            fromDate: cycleStartDate,
            toDate: cycleEndDate,
          }}
          fetchPolicy="cache-and-network"
        >
          {({ data }) => {
            if (data && data.weightLogs && data.weightLogs.length > 0) {
              const parsedData = HeightWeightUtil.parseLogData(data);
              const convertedData = HeightWeightUtil.convertWeightUnit(
                parsedData,
                weightUnit
              );
              const lossData = HeightWeightUtil.computeLoss(
                convertedData,
                programStartDate,
                isAllSelected,
                cycleStartDate
              );

              const lastWeekLostData = HeightWeightUtil.getCurrentWeekLossData(
                lossData
              );

              const monthlyLossData = HeightWeightUtil.getMonthWiseLossData(
                lossData
              );

              const logData = HeightWeightUtil.fillMissingData(
                programStartDate,
                lossData
              );

              return (
                <>
                  <CycleHistoryList
                    onChipSelected={this.handleCycleHistoryData}
                    shouldShowAllSelected
                    borderColor="#DEE6EB"
                    selectedColor="rgba(16,114,224,1)"
                    selectedTextColor="white"
                    unselectedColor="white"
                    unSelectedTextColor="rgba(2,68,129,1)"
                    dataContainerStyle={{ backgroundColor: "white" }}
                  />
                  {this.state.reRunProgressAnimation && (
                    <SummarySvg
                      topViewHeight={this.props.topViewHeight}
                      data={logData}
                      programStartDate={cycleStartDate}
                      programEndDate={cycleEndDate}
                      /**
                       * know whether to show/hide cycle labels(allcycleindicator).
                       * If all is selected, show cycle labels otherwise hide them.
                       */
                      isAllSelected={isAllSelected}
                      lastWeekLostData={lastWeekLostData}
                      monthlyLossData={monthlyLossData}
                      weightUnitText={weightUnitText}
                      weightUnit={weightUnit}
                      scrollToEnd={scrollToEnd}
                      scrollToTop={scrollToTop}
                      scrollTo={scrollTo}
                      toggleScrolling={toggleScrolling}
                    />
                  )}
                </>
              );
            }

            return (
              <>
                <CycleHistoryList
                  onChipSelected={this.handleCycleHistoryData}
                  shouldShowAllSelected
                  borderColor="#DEE6EB"
                  selectedColor="rgba(16,114,224,1)"
                  selectedTextColor="white"
                  unselectedColor="white"
                  unSelectedTextColor="rgba(2,68,129,1)"
                  dataContainerStyle={{ backgroundColor: "white" }}
                />
                {this.state.reRunProgressAnimation && (
                  <SummarySvg
                    topViewHeight={this.props.topViewHeight}
                    data={[]}
                    programStartDate={cycleStartDate}
                    programEndDate={cycleEndDate}
                    isAllSelected={isAllSelected} // know whether to show/hide cycle labels(allcycleindicator)
                    lastWeekLostData={0}
                    monthlyLossData={[]}
                    weightUnitText={weightUnitText}
                    weightUnit={weightUnit}
                    scrollToEnd={scrollToEnd}
                    scrollToTop={scrollToTop}
                    scrollTo={scrollTo}
                    toggleScrolling={toggleScrolling}
                  />
                )}
              </>
            );
          }}
        </Query>
      </View>
    );
  }
}
