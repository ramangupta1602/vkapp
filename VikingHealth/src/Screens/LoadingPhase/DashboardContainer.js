import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { GamificationModal, LoadingInstruction } from "Components";
import { R } from "../../Resources/R";
import styles from "./styles";
import { RebootDetails } from "../../Screens/OnBoard/RebootDetails";
import { PhaseComponent } from "./../OnBoard/PhaseComponent";
import CircularRing from "../../Resources/ImageFromCode/CircularRing";
import CircularProgressBar from "./CircularProgressBar";
import { withNavigation } from "react-navigation";
import AnimationContainer from "./AnimationContainer";
import { inject, observer } from "mobx-react";
import { Gamification } from "./../../utility/constants/Constants";
import * as DateUtil from "../../Library/Utils/DateUtil";
import { RewardPointsConstant } from "../../Screens/Reward/RewardData";
import { strings } from "../../utility/locales/i18n";

@observer
@inject("userAccountStore", "loginUserStore", "gamificationStore")
class LoadingDashboardContainer extends Component {
  constructor(props) {
    super(props);

    const {
      programStartDate,
      cycleStartDate,
      currentCycle,
    } = this.props.userAccountStore;

    this.slideProgress = 0;
    this.userName = this.props.userAccountStore.firstName;
    const intake = this.getCalorieIntake(this.props.calorieData);
    const rewardPoints = this.getRewardPoint(this.props.calorieData);
    this.programStartDate =
      currentCycle > 1 ? cycleStartDate : programStartDate;

    this.state = {
      shouldInfoModal: false,
      calorieIntake: intake,
      rewardPoints,
      scrollEnabled: true,
      isGamificationModalVisible: false,
      modalName: Gamification.CalorieIntakeCompleteModal,
      instructionAnimation: new Animated.Value(1),
      shouldShowInstruction: this.props.gamificationStore
        .shouldShowLoadingInstruction,
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      setTimeout(() => {
        this.checkForGamificationToShow();
      }, 1000);
    });
  }

  componentDidUpdate(oldProps) {
    if (this.props !== oldProps) {
      const calorieData = this.props.calorieData;

      const intake = this.getCalorieIntake(calorieData);
      const rewardPoints = this.getRewardPoint(calorieData);
      this.setState({ calorieIntake: intake, rewardPoints });
    }
  }

  onInfoClick = () => {
    this.setState({ shouldInfoModal: true });
  };

  getCalorieIntake = (calorieData) => {
    if (!calorieData) {
      return 0;
    }

    const { lastCalorieIntakeLog } = calorieData;
    if (!lastCalorieIntakeLog) {
      return 0;
    }

    const { calorieIntake, date } = lastCalorieIntakeLog;
    if (!calorieIntake) {
      return 0;
    }

    if (DateUtil.isAbsoluteToday(date)) {
      return calorieIntake;
    }

    return 0;
  };

  getRewardPoint = (data) => {
    if (!data) {
      return 0;
    }

    const { lastCalorieIntakeLog } = data;
    if (!lastCalorieIntakeLog) {
      return 0;
    }

    var isAddedToday = DateUtil.isAbsoluteToday(lastCalorieIntakeLog.date);
    var hasFutureData = DateUtil.isFutureDate(lastCalorieIntakeLog.date);
    var rewardPoints = lastCalorieIntakeLog.rewardPoints
      ? lastCalorieIntakeLog.rewardPoints
      : 0;

    if (!isAddedToday) {
      rewardPoints = 0;
    }

    if (hasFutureData) {
      rewardPoints = RewardPointsConstant.CalorieIntakeMax;
    }

    return rewardPoints;
  };

  checkForGamificationToShow = () => {
    const modalName = this.props.gamificationStore.shouldShowModal();

    if (modalName) {
      this.setState({ isGamificationModalVisible: true, modalName });
      return;
    }
  };

  handleGamificationModalClick = () => {
    this.props.gamificationStore.setShowModalFlag(false, null);
    this.setState({ isGamificationModalVisible: false });
  };

  startInstructionAnimation = () => {
    Animated.timing(this.state.instructionAnimation, {
      toValue: 0,
      duration: 500,
    }).start(() => {
      this.setState({
        shouldShowInstruction: false,
      });
      // this.state.shouldShowInstruction = false;
      this.props.gamificationStore.setShowLoadingInstruction(false);
    });
  };

  render() {
    const daysFromStarting =
      DateUtil.differenceInDaysForProverbs(this.programStartDate) + 1;
    const losingPhase = DateUtil.addDays(this.programStartDate, 2);
    const resetPhase = DateUtil.addDayWeek(this.programStartDate, 6, 0);

    const { width } = Dimensions.get("window");
    const widthInterpolate = this.state.instructionAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, 0],
    });

    let heightInterpolate = null;

    if (this.animatedViewHeight) {
      heightInterpolate = this.state.instructionAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.animatedViewHeight],
      });
    }

    const animatedStyle = {
      transform: [{ translateX: widthInterpolate }],
      height: heightInterpolate,
      opacity: this.state.instructionAnimation,
      overflow: "hidden",
    };

    return (
      <ScrollView
        style={[styles.containerStyle]}
        alwaysBounceVertical={false}
        bounces={false}
        scrollEnabled={this.state.scrollEnabled}
      >
        <View
          style={[
            styles.containerStyle,
            { paddingLeft: 0, paddingRight: 0, marginBottom: 20 },
          ]}
        >
          <HeaderView onInfoClick={this.onInfoClick} userName={this.userName} />

          <View style={styles.loadingPhaseContainerStyle}>
            {/* Loading phase title container */}
            <LoadingPhaseTitleContainer dayNumber={daysFromStarting} />

            {/* Animation Container */}
            <AnimationContainer
              onScrollChange={(isEnabled) => {
                this.setState({ scrollEnabled: isEnabled });
              }}
              calorieIntake={this.state.calorieIntake}
              rewardPoints={this.state.rewardPoints}
            />

            {/* Calories display component */}
            <CaloriesIntake calorieIntake={this.state.calorieIntake} />

            {/* Skip loading */}
            <View style={styles.skipLoadingContainerStyle}>
              <TouchableOpacity
                style={styles.skipLoadingButtonStyle}
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                onPress={this.props.onSkipLoadingClicked}
              >
                <Text style={styles.skipLoadingTextStyle}>
                  {strings("skipLoadingPopup.skipLoading")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {this.state.shouldShowInstruction && (
            <Animated.View
              style={animatedStyle}
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                this.animatedViewHeight = height;
              }}
            >
              <LoadingInstruction onClick={this.startInstructionAnimation} />
            </Animated.View>
          )}

          <PhaseComponent
            // containerStyle={{ marginTop: 12 }}
            phaseText="LOSING PHASE"
            descText="This is a very low calorie phase lasting 6-8 weeks. You will experience rapid, healthy weight loss without hunger or cravings."
            textColor="#4893E7"
          >
            <DateString date={"Starting " + losingPhase} />
          </PhaseComponent>

          <PhaseComponent
            style={{ margiznBottom: 0 }}
            phaseText="RESET PHASE"
            descText="In this phase you will increase your calorie intake keeping the food composition similar as of the last phase. The purpose of this is to restore your metabolism to its normal level and lock in your weight."
            textColor="#43D35C"
          >
            <DateString date={"Starting " + resetPhase} />
          </PhaseComponent>

          {this.state.shouldInfoModal && (
            <RebootModal
              onClose={() => {
                this.setState({ shouldInfoModal: false });
              }}
            />
          )}
        </View>

        <GamificationModal
          isVisible={this.state.isGamificationModalVisible}
          onClick={() => {
            this.handleGamificationModalClick();
          }}
          onBackdropPress={() => {
            this.handleGamificationModalClick();
          }}
          modalName={this.state.modalName}
        />
      </ScrollView>
    );
  }
}

export default withNavigation(LoadingDashboardContainer);

const DateString = ({ date }) => <Text style={styles.dateStyle}>{date}</Text>;

const LoadingPhaseTitleContainer = (props) => (
  <View
    style={[
      styles.loadingPhaseTitleContainer,
      { backgroundColor: "transparent" },
    ]}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        marginBottom: 2,
      }}
    >
      <CircularRing color="#F5BC2F" />
      <Text style={styles.loadingPhaseTitleStyle}>LOADING PHASE</Text>
    </View>

    <View style={styles.dayStyle}>
      <Text style={styles.dayTextStyle}>
        Day {props.dayNumber}
        <Text
          style={{
            color: "#8191A2",
            fontFamily: "Lato-Semibold",
            fontWeight: "500",
          }}
        >
          {" "}
          of 2
        </Text>
      </Text>
    </View>
  </View>
);

const CaloriesIntake = (props) => {
  const progress = Math.floor(
    Math.min(100, (props.calorieIntake / 5000) * 100)
  );

  let progressColor = "#F5BC2F";

  if (props.calorieIntake >= 5000) {
    progressColor = "#43D35C";
  }

  return (
    <View style={styles.caloriesIntakeStyle}>
      <CaloriesDisplayBox
        target={props.calorieIntake}
        unit="Kcal"
        subtext="Eaten so far"
      />
      <CircularProgressBar progress={progress} color={progressColor} />
      <CaloriesDisplayBox target=">5000" unit="Kcal" subtext="Target" />
    </View>
  );
};

const CaloriesDisplayBox = ({ target, unit, subtext }) => (
  <View>
    <Text style={styles.caloryIntakeTextStyle}>
      {target} <Text style={styles.caloryUnitTextStyle}>{unit}</Text>
    </Text>
    <Text style={styles.caloryIntakeSubTextStyle}>{subtext}</Text>
  </View>
);

const HeaderView = (props) => (
  <View>
    <View style={{ flexDirection: "row", paddingTop: 40 }}>
      <Text style={styles.pageTitleStyle}>Weight Loss Program</Text>
      <InfoButton onInfoClick={props.onInfoClick} />
    </View>
    <Text style={[styles.nameStyle]} numberOfLines={1}>
      Hey {props.userName}
    </Text>
  </View>
);

const InfoButton = (props) => (
  <TouchableOpacity onPress={props.onInfoClick}>
    <Image source={R.Images.info} style={styles.infoStyle} />
  </TouchableOpacity>
);

const RebootModal = (props) => (
  <Modal animationType="slide" transparent visible>
    <RebootDetails onCrossClicked={props.onClose} />
  </Modal>
);
