import React, { Component } from "react";
import {
  View,
  Dimensions,
  Animated,
  Easing,
  Image,
  PanResponder,
  ScrollView,
  Text,
  Platform,
} from "react-native";
import style from "./styles";
import Svg, { Defs, Path, LinearGradient, Stop } from "react-native-svg";
import { svgPathProperties } from "svg-path-properties";
import InformationView from "./Badges/InformationView";
import * as DateUtil from "../../Library/Utils/DateUtil";
import {
  SummaryCheck,
  ProgramStartMarker,
  TargetSmall,
  WeightGainedIcon,
  CompletedSmallIcon,
} from "../../Resources/Images";
import LottieView from "lottie-react-native";
import { R } from "../../Resources/R";
import { inject, observer } from "mobx-react";
import { USER_TYPE } from "Library/Constants";
import * as PathHelper from "./PathHelper";
import * as AbsoluteViewHelper from "./AbsoluteViewHelper";

const AnimatedText = Animated.createAnimatedComponent(Text);

@observer
@inject("userAccountStore", "loginUserStore", "gamificationStore")
export default class SummarySvg extends Component {
  constructor(props) {
    super(props);

    const cycleHistoryStartMonth = this.parseHistoryDataForStartingMonthIndex();

    this.state = {
      movableViewParam: { top: 0, left: 0, opacity: 0, loss: 0 },
      currentMarker: { top: -1, left: -1, opacity: 0, loss: 0, height: 22 },
      isViewAnimating: true,
      hasProgramCompleted: false,
      shouldRenderSvg: false,
      isPlayingTargetAnimation: false,
      cycleHistoryStartMonth,
    };
  }

  parseHistoryDataForStartingMonthIndex = () => {
    const {
      programStartDate,
      startDate,
      programEndDate,
      cycleHistoryData,
    } = this.props.userAccountStore;

    //pushing current cycle dates into cycle history
    cycleHistoryData.push({ startDate, endDate: programEndDate });
    const starting = [];

    cycleHistoryData.forEach((data, index) => {
      if (index === 0) return;

      const cycleStartDate = data.startDate;
      const monthDiff = DateUtil.getMonthDifference(
        programStartDate,
        cycleStartDate
      );

      if (starting.indexOf(monthDiff) !== -1) {
        starting.push(monthDiff + 0.2);
      } else {
        starting.push(monthDiff);
      }
    });

    return starting;
  };

  componentDidMount = () => {
    setTimeout(() => {
      this.startProcessing();
    }, 1000);
  };

  componentWillUnmount() {
    if (this.pathAnimation) {
      this.pathAnimation.stopAnimation(() => {
        this.scollToStartAfterEndingAnimation();
      });
    }

    if (this.quaterAnimation) {
      this.quaterAnimation.stopAnimation(() => {
        this.scollToStartAfterEndingAnimation();
      });
    }

    if (this.targetAnimation) {
      this.targetAnimation.stopAnimation(() => {
        this.scollToStartAfterEndingAnimation();
      });
    }
  }

  scollToStartAfterEndingAnimation = () => {
    if (this.props.scrollTo) {
      this.props.scrollTo({
        x: 0,
        y: 0,
        animated: false,
      });
    }
  };

  /**
   * This function is just to delay the animation so that screen transition is smooth
   * Also we are setting state to show only after calculating everything.
   */
  startProcessing = () => {
    this.pathAnimation = new Animated.Value(0);
    this.quaterAnimation = new Animated.Value(0);
    this.targetAnimation = new Animated.Value(0);

    this.badgeLocation = [];

    this.computeMonths();
    this.declarePath();
    this.extractPathProperties();

    this.pathSegmentArray = PathHelper.extractPathData(
      this.totalDays,
      this.leaderLineProperty,
      10,
      0
    );

    this.quaterPathSegment = PathHelper.extractPathData(
      100, // total no of division in starting quater path
      this.quatreLeaderLineProperty,
      10,
      1
    );

    this.broaderPathSegment = PathHelper.extractPathData(
      this.totalDays,
      this.leaderLineProperty,
      25,
      0
    );

    this.setTouchResponder();
    this.addAnimationListener();
    this.addQuatreAnimationListener();
    this.getBadgesPosition();
    this.getStartProgramLocation();

    this.fullAreaPath = PathHelper.calculateProgressArea(
      this.totalDays,
      this.pathSegmentArray
    );

    this.quaterAreaPath = PathHelper.calculateProgressArea(
      100,
      this.quaterPathSegment
    );

    this.getBadgesAndLabel();
    this.getCycleIndicatorPosition();

    this.getTargetAnimationView();
    this.startAnimation();

    this.dummyCurrentProgressArea = PathHelper.calculateProgressArea(
      this.totalDays,
      this.broaderPathSegment
    );

    this.setState({
      shouldRenderSvg: true,
      hasProgramCompleted: this.hasProgramCompleted,
    });
  };

  computeMonths = () => {
    this.month =
      DateUtil.getMonthDifference(
        this.props.programStartDate,
        this.props.programEndDate
      ) + 1;

    // this variable simply divide one day in that many fraction. This become very
    // significant when user start to drag. The lower its value is the lower will be
    // accuracy between drag location and the filled gradient
    this.precisionGranuality = 5;

    this.actualTotal = (this.month - 1) * 28 * this.precisionGranuality;
    this.totalDays = this.month * 30 * this.precisionGranuality; // for symmetry sake each month is of 28 days (4 week)

    // this function return today - startDate,
    // -1 so that loop run equivalent to < diff (while extractin data)
    this.currentProgress =
      DateUtil.absoluteDifferenceFromToday(this.props.programStartDate) - 1;

    this.currentProgress = this.currentProgress * this.precisionGranuality;

    // if user set his clock before program startdate then it will be negative and will
    // cause app crash, therefore setting it 0
    if (this.currentProgress < 0) {
      this.currentProgress = 0;
    }

    // if current date has program end date, then only set hasProgramCompleted to true
    // else if is just rounding so keep current progress little less than target to indicate
    // user that program has not completed.
    const diff = DateUtil.absoluteDifferenceFromToday(
      this.props.programEndDate
    );

    if (diff >= 0) {
      this.currentProgress = this.actualTotal;
      this.hasProgramCompleted = true;

      if (this.props.data.length > 0) {
        this.weightAtTheEndOfProgram = this.props.data[
          this.props.data.length - 1
        ].loss;
      } else {
        // if case no data if found, most probably in case of empty state,  0 will help to show program completed message.
        this.weightAtTheEndOfProgram = 0;
      }
    } else {
      // this.currentProgress = this.actualTotal;
      this.hasProgramCompleted = false;
    }
  };

  declarePath = () => {
    const { width } = Dimensions.get("screen");

    this.width = width;
    this.height = (this.month / 2) * 100 + (this.month / 2) * 140 + 220;
    this.straightLineLength = width - 180;

    const outerContourLineParameter = {
      month: this.month,
      straightLineLength: this.straightLineLength,
      innerRadius: 40,
      outerRadius: 60,
      offset: 110, // Y distance from top
      curveOffset: 20,
    };

    const leaderLineParameter = {
      month: this.month,
      straightLineLength: this.straightLineLength,
      innerRadius: 50,
      outerRadius: 50,
      offset: 120, // Y distance from top
      curveOffset: 15,
    };

    const innerContourLineParameter = {
      month: this.month,
      straightLineLength: this.straightLineLength,
      innerRadius: 60,
      outerRadius: 40,
      offset: 130, // Y distance from top
      curveOffset: 10,
    };

    const broaderContourLineParameter = {
      month: this.month,
      straightLineLength: this.straightLineLength,
      innerRadius: 30,
      outerRadius: 70,
      offset: 100, // Y distance from top
      curveOffset: 20,
    };

    const broaderInnerContourLineParameter = {
      month: this.month,
      straightLineLength: this.straightLineLength,
      innerRadius: 70,
      outerRadius: 30,
      offset: 140, // Y distance from top
      curveOffset: 10,
    };

    this.outerContourLine = PathHelper.getFullPath(outerContourLineParameter); // outer
    this.leaderLine = PathHelper.getFullPath(leaderLineParameter); // leader
    this.innerContourLine = PathHelper.getFullPath(innerContourLineParameter); // inner

    this.bOCLine = PathHelper.getFullPath(broaderContourLineParameter);
    this.bOCLineInner = PathHelper.getFullPath(
      broaderInnerContourLineParameter
    );

    //Starting quater path
    this.quatreInnerPath = PathHelper.getStartingQuatrePath(75, 10, 60);
    this.quatreLeaderPath = PathHelper.getStartingQuatrePath(75, 20, 50);
    this.quatreOuterPath = PathHelper.getStartingQuatrePath(75, 30, 40);
  };

  /**
   *******************************************************
   *************** Path Data extraction   *******************
   *******************************************************
   */

  extractPathProperties = () => {
    this.leaderLineProperty = new svgPathProperties(this.leaderLine);
    this.outerContourProperty = new svgPathProperties(this.outerContourLine);
    this.innerContourProperty = new svgPathProperties(this.innerContourLine);
    this.bOCLineProperty = new svgPathProperties(this.bOCLine);
    this.bOCLineInnerProperty = new svgPathProperties(this.bOCLineInner);

    this.quatreLeaderLineProperty = new svgPathProperties(
      this.quatreLeaderPath
    );
    this.quatreOuterLinePropterty = new svgPathProperties(this.quatreOuterPath);
    this.quatreInnerLineProperty = new svgPathProperties(this.quatreInnerPath);
  };

  getStartProgramLocation = () => {
    const { x, y } = this.quatreLeaderLineProperty.getPointAtLength(0);
    const parameter = {
      x,
      y,
      markerImage: ProgramStartMarker,
      programStartDate: this.props.programStartDate,
    };
    this.startProgramView = AbsoluteViewHelper.getStartProgramView(parameter);
  };

  getBadgesPosition = () => {
    this.badgeLocation = [];

    for (let i = 1; i <= this.month; ++i) {
      const parameter = {
        length: i * 30,
        segmentArray: this.pathSegmentArray,
        granularity: this.precisionGranuality,
        height: 70,
      };

      this.badgeLocation.push(PathHelper.getPointAtLocation(parameter));
    }
  };

  getCycleIndicatorPosition = () => {
    // show all allCycleIndicator label
    if (this.props.isAllSelected) {
      const { cycleHistoryStartMonth } = this.state;
      const cycleIndicatorPosition = [];

      for (let i = 0; i < cycleHistoryStartMonth.length; ++i) {
        const month = cycleHistoryStartMonth[i];

        const parameter = {
          length: month * 30,
          segmentArray: this.pathSegmentArray,
          granularity: this.precisionGranuality,
          height: -10,
        };

        const location = PathHelper.getPointAtLocation(parameter);

        // now adjusting based on left and right position
        if (month % 2 === 0) {
          location.x += 30;
        } else {
          location.x -= 30;
        }
        // pushing month so that we can determine its orientation
        location.month = month;
        cycleIndicatorPosition.push(location);
      }

      this.allCycleIndicator = AbsoluteViewHelper.CycleDemarcationIndicator(
        cycleIndicatorPosition
      );
    } else {
      // do not show allCycleIndicator
      this.allCycleIndicator = AbsoluteViewHelper.CycleDemarcationIndicator(
        null
      );
    }
  };

  /**
   *******************************************************
   *************** Touch Responder   *******************
   *******************************************************
   */
  // There was an issue in pan responder in Android. therefore I have to
  // find workaround for getting the scrolling position.
  // Issue link: https://github.com/facebook/react-native/issues/15290
  setTouchResponder = () => {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event) => {
        if (this.state.isViewAnimating) {
          return false;
        }

        return true;
      },
      onStartShouldSetPanResponderCapture: (event) => true,
      onMoveShouldSetPanResponder: (event) => false,
      onMoveShouldSetPanResponderCapture: (event) => false,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        if (this.state.isViewAnimating) {
          return false;
        }

        if (!this.props.toggleScrolling) {
          return true;
        }

        this.props.toggleScrolling(false);
        return true;
      },
      onPanResponderStart: (evt) => {
        if (this.state.isViewAnimating) {
          return false;
        }

        this.locationXPageOffset =
          evt.nativeEvent.pageX - evt.nativeEvent.locationX;
        this.locationYPageOffset =
          evt.nativeEvent.pageY - evt.nativeEvent.locationY;
        const { locationX, locationY } = evt.nativeEvent;
        this.getTouchStartingPosition(locationX, locationY);
      },
      onPanResponderMove: (evt) => {
        if (this.state.isViewAnimating) {
          return false;
        }

        const locationX = evt.nativeEvent.pageX - this.locationXPageOffset;
        const locationY = evt.nativeEvent.pageY - this.locationYPageOffset;
        this.getTouchStartingPosition(locationX, locationY);
      },
      onPanResponderRelease: () => {
        this.setState({
          currentMarker: {
            ...this.state.currentMarker,
            height: 22,
          },
        });

        if (!this.props.toggleScrolling) {
          return true;
        }

        this.props.toggleScrolling(true);
      },
      onPanResponderTerminate: () => {
        this.setState({
          currentMarker: {
            ...this.state.currentMarker,
            height: 22,
          },
        });
        if (!this.props.toggleScrolling) {
          return true;
        }

        this.props.toggleScrolling(true);
      },
    });
  };

  getTouchStartingPosition = (locationX, locationY) => {
    for (let i = 0; i < this.totalDays - 1; ++i) {
      const {
        inner: { x: ix, y: iy },
      } = this.broaderPathSegment[i];
      const {
        outer: { x: ox, y: oy },
      } = this.broaderPathSegment[i + 1];
      const {
        leader: { x: mx, y: my },
      } = this.broaderPathSegment[i + 1];

      const point = { x: locationX, y: locationY };
      const rect = { ix, iy, ox, oy };

      const isViewInRect = this.checkPointInRect(point, rect);

      if (isViewInRect) {
        this.movePointertoLocation({ x: mx, y: my }, i + 1);
        return;
      }
    }
  };

  movePointertoLocation = (point, position) => {
    // user is scrolling outside his current date but when progrom is completed we would
    if (position > this.currentProgress && !this.hasProgramCompleted) {
      return;
    }

    this.area = PathHelper.calculateProgressArea(
      position,
      this.pathSegmentArray
    );

    if (this._animatedPath) {
      this._animatedPath.setNativeProps({
        d: this.area,
      });
    }

    const index = Math.floor(position / this.precisionGranuality);
    const day = index;
    const logData = this.props.data[day];

    let loss = 0;

    if (logData) {
      loss = logData.loss;
    } else {
      loss = this.state.currentMarker.loss;
    }

    this.setState({
      currentMarker: {
        top: point.y - 50,
        left: point.x - 25,
        opacity: 1,
        height: 50,
        loss,
      },
    });
    this.pathAnimation.setValue(position);
  };

  checkPointInRect(point, rect) {
    const { x, y } = point;
    const { ix, iy, ox, oy } = rect;
    let isPointInRect = true;

    // checking if point.x is in range of inner and outer x
    if (!((x <= ix && x >= ox) || (x <= ox && x >= ix))) {
      isPointInRect = false;
    }

    if (!((y <= iy && y >= oy) || (y <= oy && y >= iy))) {
      isPointInRect = false;
    }

    return isPointInRect;
  }

  addAnimationListener = () => {
    this.pathAnimation.addListener(({ value }) => {
      this.area = PathHelper.calculateProgressArea(
        value,
        this.pathSegmentArray
      );

      const point = this.pathSegmentArray[Math.floor(value)];
      const dataIndexFromPath = Math.floor(value / this.precisionGranuality);
      const logData = this.props.data[dataIndexFromPath];

      let loss = this.state.currentMarker.loss;

      if (logData) {
        loss = logData.loss;
      } else if (dataIndexFromPath > this.props.data.length) {
        // in one case data.length was 0, so this condition.
        if (this.props.data.length > 0) {
          loss = this.props.data[this.props.data.length - 1].loss;
        } else {
          loss = 0;
        }
      }

      const {
        leader: { x, y },
      } = point;

      if (this.state.isViewAnimating) {
        this.setState({
          currentMarker: {
            top: y - 50,
            left: x - 25,
            opacity: 1,
            loss,
            height: 22,
          },
        });

        if (this.props.scrollTo && !this.state.isPlayingTargetAnimation) {
          this.props.scrollTo({
            x: 0,
            y: y - 250,
            animated: false,
          });
        }
      }

      if (!this._animatedPath) {
        return;
      }

      this._animatedPath.setNativeProps({
        d: this.area,
      });
    });
  };

  addQuatreAnimationListener = () => {
    this.quaterAnimation.addListener(({ value }) => {
      this.quatreAreaPath = PathHelper.calculateProgressArea(
        value,
        this.quaterPathSegment
      );

      const point = this.quaterPathSegment[Math.floor(value)];

      const dataIndexFromPath = Math.floor(value);
      const logData = this.props.data[dataIndexFromPath];

      let loss = 0;

      if (logData) {
        loss = logData.loss;
      }

      const {
        leader: { x, y },
      } = point;

      if (this.state.isViewAnimating) {
        this.setState({
          currentMarker: {
            top: y - 50,
            left: x - 25,
            opacity: 0,
            loss,
            height: 22,
          },
        });
      }

      if (this._quatreArea) {
        this._quatreArea.setNativeProps({
          d: this.quatreAreaPath,
        });
      }
    });
  };

  // useNativeDriver is causing empty svg therefore just using it with
  // ios where it is available.
  startAnimation = () => {
    const totalAniamationTime =
      (2000 * (this.currentProgress / 30)) / this.precisionGranuality;

    Animated.timing(this.quaterAnimation, {
      toValue: 100, // no of segment in quater line, it is fixed
      duration: 900,
    }).start(() => {
      Animated.timing(this.pathAnimation, {
        toValue: this.currentProgress,
        duration: totalAniamationTime, // 2 seconds per month, current
        easing: Easing.linear,
        useNativeDriver: Platform.OS === "ios",
      }).start(() => {
        this.startPathAnimation();
      });
    });
  };

  startPathAnimation = () => {
    // If program is completed then hide current marker and start lottie animation
    if (this.state.hasProgramCompleted) {
      this.setState({
        currentMarker: {
          ...this.state.currentMarker,
          opacity: 0,
        },
      });

      Animated.timing(this.pathAnimation, {
        toValue: this.totalDays,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: Platform.OS === "ios",
      }).start(() => {
        this.setAnimationStateOff(0);
        this.startTargetAnimation();
      });
    } else {
      this.setState({ isViewAnimating: false });
      this.setAnimationStateOff(1);
    }
  };

  setAnimationStateOff = (finalOpacity) => {
    this.setState({
      currentMarker: {
        ...this.state.currentMarker,
        opacity: finalOpacity,
      },
    });
  };

  startTargetAnimation = () => {
    Animated.timing(this.targetAnimation, {
      toValue: 1,
      easing: Easing.linear,
      duration: 2000,
      useNativeDriver: true,
      isPlayingTargetAnimation: true,
    }).start(() => {
      this.setState({ isViewAnimating: false });
    });

    if (this.props.scrollToEnd) {
      this.props.scrollToEnd();
    }
  };

  /**
   * this will accept cycle starting month array like [2,5,6,8]
   * and then return a array of length = total months and each index value represent
   * month no and its value represent its cycle no i.e. [1,2,2,2,3,3,4,4,....]
   */
  flattenMonthStartingPoint = () => {
    const { cycleHistoryStartMonth } = this.state;

    let previousCycleStaringMonth = 0;
    const cycleFlattenArray = [];

    cycleHistoryStartMonth.map((startingMonth) => {
      let monthCount = 1;
      // when two cycle are overlapping , I am adding extra 0.2 in start month so that
      // cycle indicator is little pushed off.

      const intStartingMonth = Math.floor(startingMonth);
      for (let i = previousCycleStaringMonth; i < intStartingMonth; ++i) {
        cycleFlattenArray.push(monthCount);
        monthCount += 1;
      }

      previousCycleStaringMonth = intStartingMonth;
    });

    // now for the last cycle push count starting from 0,
    let monthCount = 1;
    for (let i = cycleFlattenArray.length; i < this.month - 1; ++i) {
      cycleFlattenArray.push(monthCount);
      monthCount += 1;
    }

    return cycleFlattenArray;
  };

  getBadgesAndLabel = () => {
    this.badges = [];
    this.lables = [];

    const cycleStartFlattenArray = this.flattenMonthStartingPoint();

    // output range = 0 -
    const monthOutputRange = this.pathAnimation.interpolate({
      inputRange: [0, this.totalDays],
      outputRange: [0, this.month],
    });

    const firstName = this.props.userAccountStore.firstName.substring(0, 15);

    this.badgeLocation.forEach((value, index) => {
      const { x, y } = value;
      const loss = this.getLossDataForMonth(index + 1);
      const userType = this.props.loginUserStore.userType;
      const weightUnitText = this.props.weightUnitText;
      const displayTargetWeight = this.props.userAccountStore
        .displayTargetWeight;
      const isTargetView = this.badgeLocation.length - 1 === index;

      const displayMonth = cycleStartFlattenArray[index];

      const parameter = {
        index,
        x,
        y,
        firstName,
        monthOutputRange,
        loss,
        userType,
        weightUnitText,
        displayTargetWeight,
        isTargetView,
        displayMonth,
        width: this.width,
      };

      const { badges, labels } = AbsoluteViewHelper.getBadgeView(parameter);

      this.badges.push(...badges);
      this.lables.push(...labels);
    });
  };

  getTargetAnimationView = () => {
    const { y } = this.badgeLocation[this.badgeLocation.length - 1];
    const xOffset = this.month % 2 === 0 ? -20 : -75;
    const targetWeightAsperUnit = this.props.userAccountStore
      .displayTargetWeight;
    if (!this.hasProgramCompleted) {
      return <View />;
    }

    let text = "Program Completed";

    if (
      this.weightAtTheEndOfProgram <= targetWeightAsperUnit &&
      this.weightAtTheEndOfProgram != 0
    ) {
      text = `Achieved target weight of ${targetWeightAsperUnit} ${this.props.weightUnitText}`;
    }

    this.targetView = (
      <View
        style={[
          style.svgBoxStyle,
          {
            // Was y+20, updated to y+10 becuase view was getting distorted from bottom in case of 1/2 month cycle.
            top: y + 10,
            left: this.straightLineLength / 2 + xOffset,
            width: 150,
            height: 220,
          },
        ]}
      >
        <LottieView
          style={{ width: 150, height: 200 }}
          source={
            this.props.userAccountStore.gender === "female"
              ? R.Animations.OB3Female
              : R.Animations.OB3Male
          }
          progress={this.targetAnimation}
        />
        <AnimatedText
          style={[
            style.targetTextStyle,
            {
              opacity: this.targetAnimation,
            },
          ]}
        >
          {text}
        </AnimatedText>
      </View>
    );
  };

  getLossDataForMonth = (month) => {
    const { monthlyLossData } = this.props;
    let lastRecordedLossData = 0;

    for (let i = 0; i < monthlyLossData.length; ++i) {
      const data = monthlyLossData[i];
      if (data.month === month) {
        return data.loss;
      }

      if (data.month < month) {
        lastRecordedLossData = data.loss;
      }
    }

    return lastRecordedLossData;
  };

  getTopBadgeText() {
    if (this.state.hasProgramCompleted) {
      return this.getTopBadeWhenTargetIsCompleted();
    }

    const firstName = this.props.userAccountStore.firstName.substring(0, 15);

    const { lastWeekLostData } = this.props;
    const roundedWeeklyLost = lastWeekLostData.toFixed(1);

    let icon = SummaryCheck;
    let color = "#43D35C";

    const appendingTextNegative =
      this.props.loginUserStore.userType == USER_TYPE.PATIENT
        ? "You haven't"
        : `${firstName} hasn't`;

    const appendingTextPositive =
      this.props.loginUserStore.userType == USER_TYPE.PATIENT
        ? "You have"
        : `${firstName} has`;

    let text = "";
    if (lastWeekLostData === 0) {
      text = `${appendingTextNegative} lost any weight this week`;
    } else if (lastWeekLostData > 0) {
      text = `Great! ${appendingTextPositive} lost ${roundedWeeklyLost} ${this.props.weightUnitText} this week`;
    } else {
      icon = WeightGainedIcon;
      text = `${appendingTextPositive} gained ${-roundedWeeklyLost} ${
        this.props.weightUnitText
      } this week`;
      color = "#ED485C";
    }

    return {
      text,
      loss: lastWeekLostData,
      icon,
      imageDimension: { width: 32, height: 37 },
      margin: 3,
      color,
    };
  }

  // I am assuming 1st record as the starting weight
  getTopBadeWhenTargetIsCompleted = () => {
    const targetWeightAsperUnit = this.props.userAccountStore
      .displayTargetWeight;

    let icon = CompletedSmallIcon;
    const firstName = this.props.userAccountStore.firstName.substring(0, 15);

    const nameText =
      this.props.loginUserStore.userType === USER_TYPE.PATIENT
        ? "You have"
        : `${firstName} has`;

    const your =
      this.props.loginUserStore.userType === USER_TYPE.PATIENT ? "your" : "the";

    let text = `Awesome! ${nameText} completed ${your} cycle.`;

    if (
      this.weightAtTheEndOfProgram <= targetWeightAsperUnit &&
      this.weightAtTheEndOfProgram != 0
    ) {
      text = `Awesome! ${nameText} reached ${your} target weight of ${targetWeightAsperUnit} ${this.props.weightUnitText}`;
      icon = TargetSmall;
    }
    return {
      text,
      loss: 0,
      icon,
      imageDimension: { width: 40, height: 40 },
      margin: 5,
    };
  };

  render() {
    const {
      text,
      icon,
      imageDimension,
      margin,
      color = "#43D35C",
    } = this.getTopBadgeText();

    return (
      this.state.shouldRenderSvg && (
        <View style={{ flex: 1 }}>
          <View style={[style.achievementBoxContainerStyle]}>
            <View
              style={{
                position: "absolute",
                left: imageDimension.width / 2,
                right: 0,
                top: margin,
                bottom: margin,
                backgroundColor: "white",
                borderRadius: 4,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Image
                source={icon}
                resizeMode="cover"
                style={[imageDimension, { height: "100%" }]}
              />
              <Text
                style={[
                  style.achievementTextStyle,
                  {
                    flexDirection: "row",
                    flexWrap: "wrap",
                    flexShrink: 1,
                    color,
                  },
                ]}
              >
                {text}
              </Text>
            </View>
          </View>
          <ScrollView
            ref={(ref) => {
              // this.scrollRef = ref;
            }}
            scrollEnabled={!this.state.isViewAnimating}
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
            }}
          >
            {this.lables}

            <Svg
              style={{
                width: this.width,
                height: this.height,
              }}
            >
              <Defs>
                <LinearGradient
                  x1="-16.519%"
                  y1="45.524%"
                  x2="128.234%"
                  y2="54.752%"
                  id="prefix__c"
                >
                  <Stop stopColor="#86A8E7" offset="0%" />
                  <Stop stopColor="#47AEE0" offset="46.426%" />
                  <Stop stopColor="#91EAE4" offset="100%" />
                </LinearGradient>
              </Defs>
              <Path
                d={this.fullAreaPath}
                // stroke='black'
                fill="white"
                fillRule="evenodd"
              />

              <Path
                d={this.quaterAreaPath}
                // stroke='black'
                fill="white"
                fillRule="evenodd"
              />

              <Path
                d={this.outerContourLine}
                stroke="#D9E5ED"
                strokeWidth={1}
                fill="none"
              />
              <Path
                d={this.innerContourLine}
                stroke="#D9E5ED"
                strokeWidth={1}
                fill="none"
              />

              <Path
                d={this.quatreAreaPath || "M0 0"}
                ref={(ref) => (this._quatreArea = ref)}
                stroke="none"
                // fill="red"
                fill="#86A8E7"
                fillRule="evenodd"
              />

              {/* area path was here */}
              <Path
                d={this.area || "M0 0"}
                ref={(ref) => (this._animatedPath = ref)}
                stroke="none"
                // fill="red"
                fill="url(#prefix__c)"
                fillRule="evenodd"
              />

              <Path
                d={this.leaderLine}
                stroke="#D9E5ED"
                strokeWidth={1}
                fill="none"
                strokeDasharray="3,5"
              />

              {this.badges}
              {this.targetView}
              {this.allCycleIndicator}

              <Path
                d={this.quatreLeaderPath}
                stroke="#D9E5ED"
                strokeWidth={1}
                fill="none"
                strokeDasharray="3,5"
              />

              {this.startProgramView}

              <Animated.View
                {...this.panResponder.panHandlers}
                ref={(ref) => {
                  this._currentMarker = ref;
                }}
                style={[
                  style.movableViewStyle,
                  { ...this.state.currentMarker },
                ]}
              >
                <InformationView
                  loss={this.state.currentMarker.loss}
                  height={this.state.currentMarker.height}
                />
              </Animated.View>

              <Path
                {...this.panResponder.panHandlers}
                d={this.dummyCurrentProgressArea}
                stroke="none"
                fill="none"
                fillRule="evenodd"
              />
            </Svg>
          </ScrollView>
        </View>
      )
    );
  }
}
