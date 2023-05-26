import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { UnitSelection } from "../UnitSelection";
import * as DateUtil from "Library/Utils/DateUtil";
import moment from "moment";
import { styles } from "./Styles";
import { R } from "Resources";

const SelectedTab = {
  ALL: 0,
  PERIOD: 1,
};

export class DateSelection extends Component {
  constructor(props) {
    super(props);

    const date = props.date;
    this.isWeek = props.isWeek;

    this.dateFormat = "DD MMM";
    this.programStartDate = moment(this.props.programStartDate);
    this.programEndDate = moment(this.props.programEndDate);
    let dateRange;

    if (this.isWeek) {
      dateRange = DateUtil.weekRangeFor(date);
    } else {
      dateRange = DateUtil.monthRangeFor(
        moment(),
        this.programStartDate,
        this.programEndDate
      );

      const { begin, end } = dateRange;
      const dateDiff = end.diff(this.programEndDate, "d");

      // means month end date spills over program end date, so cut it down to program end date
      if (dateDiff > 0) {
        dateRange = { begin, end: this.programEndDate };
      }
    }

    const isLeftArrowEnabled = dateRange.begin.isAfter(this.programStartDate);
    const isRightArrowEnabled = this.programEndDate.isAfter(dateRange.end);

    this.state = {
      tabSelected: SelectedTab.PERIOD,
      startDate: dateRange.begin,
      endDate: dateRange.end,
      isLeftArrowEnabled,
      isRightArrowEnabled,
      currentDate: date,
    };
    this.notifyParent();
  }

  onAllTabClicked() {
    // now we are passing appropriate dates from detail screen only
    const endDate = this.programEndDate;

    this.setState(
      {
        tabSelected: SelectedTab.ALL,
        isLeftArrowEnabled: false,
        isRightArrowEnabled: false,
        startDate: this.programStartDate,
        endDate,
      },
      () => {
        this.updateRangeForDate(this.state.currentDate);
      }
    );
  }

  onSecondTabClicked() {
    this.setState({ tabSelected: SelectedTab.PERIOD }, () => {
      this.updateRangeForDate(this.state.currentDate);
    });
  }

  onBackArrowClicked() {
    const lastDate = DateUtil.previousDate(this.state.startDate);
    this.updateRangeForDate(lastDate);
  }

  onRightArrowClicked() {
    let nextDate = DateUtil.nextDate(this.state.endDate);

    if (!this.isWeek) {
      nextDate = DateUtil.nextMonth(this.state.endDate);

      if (nextDate.diff(this.state.endDate, "d") < 0) {
        nextDate = this.state.endDate;
      }
    }

    this.updateRangeForDate(nextDate);
  }

  updateRangeForDate(date) {
    let dateRange;

    let startDate;
    let endDate;
    let isLeftArrowEnabled = false;
    let isRightArrowEnabled = false;

    if (this.state.tabSelected === SelectedTab.ALL) {
      startDate = this.programStartDate;
      endDate = this.programEndDate;
    } else {
      if (this.isWeek) {
        dateRange = DateUtil.weekRangeFor(date);
      } else {
        dateRange = DateUtil.monthRangeFor(
          date,
          this.programStartDate,
          this.programEndDate
        );

        const { begin, end } = dateRange;
        const dateDiff = end.diff(this.programEndDate, "d");

        // means month end date spills over program end date, so cut it down to program end date
        if (dateDiff > 0) {
          dateRange = { begin, end: this.programEndDate };
        }
      }

      startDate = dateRange.begin;
      endDate = dateRange.end;

      isLeftArrowEnabled = dateRange.begin.isAfter(this.programStartDate);
      isRightArrowEnabled = this.programEndDate.isAfter(dateRange.end);
    }

    this.setState({
      startDate,
      endDate,
      currentDate: date,
      isLeftArrowEnabled,
      isRightArrowEnabled,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.programStartDate !== prevProps.programStartDate &&
      this.props.programEndDate !== prevProps.programEndDate
    ) {
      this.programStartDate = moment(this.props.programStartDate);
      this.programEndDate = moment(this.props.programEndDate);
      this.updateRangeForDate(this.props.date);
    }

    if (prevState != this.state) {
      this.notifyParent();
    }
  }

  notifyParent() {
    const { startDate, endDate, tabSelected } = this.state;
    if (typeof this.props.dateRangeUpdated === "function") {
      this.props.dateRangeUpdated(startDate, endDate, tabSelected);
    }
  }

  render() {
    const { isLeftArrowEnabled, isRightArrowEnabled } = this.state;

    const startDateFormatted = this.state.startDate.format(this.dateFormat);
    const endDateFormatted = this.state.endDate.format(this.dateFormat);
    const dateRange = `${startDateFormatted} - ${endDateFormatted}`;

    return (
      <View style={styles.container}>
        <View style={styles.dateContainer}>
          <TouchableOpacity
            accessibilityLabel={"backArrow"}
            testID={"backArrow"}
            onPress={() => {
              this.onBackArrowClicked();
            }}
            disabled={!isLeftArrowEnabled}
          >
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Image
                source={R.Images.leftArrowDate}
                style={[
                  styles.imageArrow,
                  { opacity: isLeftArrowEnabled ? 1.0 : 0.2 },
                ]}
              />
            </View>
          </TouchableOpacity>

          <Text style={styles.textStyle}>{dateRange}</Text>

          <TouchableOpacity
            onPress={() => {
              this.onRightArrowClicked();
            }}
            disabled={!isRightArrowEnabled}
            accessibilityLabel={"forwardArrow"}
            testID={"forwardArrow"}
          >
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Image
                source={R.Images.rightArrowDate}
                style={[
                  styles.imageArrow,
                  { opacity: isRightArrowEnabled ? 1.0 : 0.2 },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.containerAllWeek}>
          <UnitSelection
            tabSelectionChanged={(index) => {
              if (index == 0) {
                this.onAllTabClicked();
              } else {
                this.onSecondTabClicked();
              }
            }}
            firstTab={"All"}
            secondTab={this.isWeek ? "Week" : "Month"}
          />
        </View>
      </View>
    );
  }
}
