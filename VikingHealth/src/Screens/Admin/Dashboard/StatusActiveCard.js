import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert
} from "react-native";
import * as Progress from "react-native-progress";
import { R } from "Resources";
import { styles } from "./CardStyles";
import { inject, observer } from "mobx-react";
import * as DateUtil from "Library/Utils/DateUtil";
import AppUtil from "Library/Utils/AppUtil";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import { RandomColors, CycleIndicator } from "Components";
import moment from "moment";
import { STATUS_USER } from "Library/Constants";
import { Mutation, Query } from "react-apollo";
import Toast, { DURATION } from "react-native-easy-toast";
import * as UserQueries from "AppSyncQueries/UserQueries";

const MAX_LIMIT_NAME = 23;

@inject("userAccountStore", "loginUserStore", "rewardStore")
@observer
export class StatusActiveCard extends Component {
  constructor(props) {
    super(props);
  }
  isStatusActive() {
    return this.props.data.status === STATUS_USER.ACTIVE;
  }

  programStrings() {
    let ProgramEndDate = this.props.data.programEndDate;
    let currentDate = AppUtil.getCurrentDate();
    return AppUtil.currentStatus(ProgramEndDate, currentDate);
  }

  fadedBox() {
    if (this.props.data.status === STATUS_USER.COMPLETED) {
      return 0.6;
    } else {
      return 1;
    }
  }

  getHeight(height, heightUnit) {
    return HeightWeightUtil.displayHeight(
      height,
      heightUnit,
      this.props.loginUserStore.displayHeightUnit
    );
  }
  getWeight(targetWeight, weightUnit) {
    return HeightWeightUtil.weightUnit(targetWeight, weightUnit);
  }
  saveToStore() {
    return;
  }

  CardPressed(data) {
    this.props.userAccountStore.setUserData(data);
    this.props.rewardStore.setRewardPointFromUserProfile(
                        data.rewardPoints,
                        data.rewardPointsHistory
                      );
    //TODO:- Later do it by updating the user store instead of login store.
    this.props.loginUserStore.setDisplayWaterIntakeUnit(data.waterIntakeUnit);
    this.props.loginUserStore.setTargetWaterLevel(
      data.waterIntakeUnit === HeightWeightUtil.WATER_FLOZ
        ? HeightWeightUtil.ozValue(data.targetWaterIntake)
        : data.targetWaterIntake
    );


    this.props.onClick();
  }

  returnActivateButton(activatePatient, loading, text) {
    return (
      <TouchableOpacity
        style={{ position: "absolute", right: 0 }}
        onPress={() => {
          activatePatient({
            variables: {
              userId: this.props.data.userId
            },
            refetchQueries: [
              {
                query: UserQueries.PatientList,
                variables: {
                  limit: 10,
                  nextToken: null,
                  type: STATUS_USER.ACTIVE
                }
              },
              {
                query: UserQueries.PatientList,
                variables: {
                  limit: 10,
                  nextToken: null,
                  type: STATUS_USER.COMPLETED
                }
              }
            ]
          });
        }}
      >
        {!loading && (
          <Text
            style={{
              color: R.Colors.COLOR_BLUE,
              fontWeight: "bold",
              fontFamily: "Lato",
              fontSize: 14,
              right: 20
            }}
          >
            Activate
          </Text>
        )}
        {loading && (
          <View style={{ marginRight: 10 }}>
            <ActivityIndicator size="small" color={R.Colors.COLOR_BLUE} />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  userActivatedSuccessfully(isSuccess, message) {
    if (this.props.callback) {
      this.props.callback(isSuccess, message);
    }
  }

  renderActivate() {
    return (
      <Mutation mutation={UserQueries.ActivatePatient}>
        {(activatePatient, { loading, error, data }) => {
          if (data && data.activatePatient) {
            if (data.activatePatient.httpStatus == 200) {
              this.userActivatedSuccessfully(
                true,
                "User has been Activated successfully!"
              );
            } else {
              this.userActivatedSuccessfully(
                false,
                data.activatePatient.errorMessage
              );
              Alert.alert("Error", data.activatePatient.errorMessage);
            }
          } else if (error) {
            this.userActivatedSuccessfully(false, "Something went wrong");
          }
          return this.returnActivateButton(
            activatePatient,
            loading,
            "Activate"
          );
        }}
      </Mutation>
    );
  }

  render() {
    let programEndDate = moment(this.props.data.programEndDate);
    let programStartDate = moment(this.props.data.programStartDate);
    let progress = AppUtil.progressReport(programEndDate, programStartDate);
    let detail = this.props.data;
    let name = detail.firstName + " " + detail.lastName;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.CardPressed(detail);
        }}
      >
        <View
          style={[
            styles.boxWithShadow,
            styles.container,
            {
              backgroundColor: "#fff",
              opacity: this.fadedBox(),
              position: "relative"
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <RandomColors
              gender={detail.gender}
              height={42}
              width={42}
              number={this.props.data.phoneNumber}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "row"
                }}
              >
                <Text style={styles.nameStyle}>
                  {AppUtil.truncateText(name, MAX_LIMIT_NAME)}
                </Text>
                {!this.isStatusActive() && this.renderActivate()}
              </View>
              <View style={styles.subInfo}>
                <Text style={styles.subInfoTextStyle}>
                  {/* {this.props.userAccountStore.displayAge()} */}
                  {DateUtil.AgeCalculate(detail.dob)}yr {""} {""}
                </Text>

                {detail.lastAcceptedCycle > 1 && (
                  <CycleIndicator
                    currentCycle={detail.lastAcceptedCycle || 1}
                  />
                )}
              </View>
            </View>
          </View>

          <View style={styles.programEndContainer}>
            <Text style={styles.programEndStyle}>
              {this.programStrings()}{" "}
              {DateUtil.getFormattedDate(detail.programEndDate)}
            </Text>
          </View>

          <View style={{ marginVertical: 8 }}>
            <Progress.Bar
              borderWidth={0}
              color={"rgb(145,222,102)"}
              unfilledColor={"#E7F3FB"}
              progress={progress}
              height={5}
              borderRadius={4.5}
              width={Dimensions.get("window").width - 64}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
