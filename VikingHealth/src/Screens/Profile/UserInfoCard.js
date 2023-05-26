import React, { Component } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import * as Progress from "react-native-progress";

import { strings } from "../../utility/locales/i18n";
import { inject, observer } from "mobx-react";
import moment from "moment";
import AppUtil from "Library/Utils/AppUtil";
import { Query } from "react-apollo";
import * as UserQueries from "AppSyncQueries/UserQueries";
import { USER_TYPE } from "Library/Constants";
import styles from "./UserInfoCardStyle";
import * as DateUtil from "../../Library/Utils/DateUtil";

@inject("userAccountStore", "loginUserStore")
@observer
export class UserInfoCard extends Component {
  render() {
    const { userAccountStore } = this.props;
    const userId = this.props.loginUserStore.userId;
    const isPatient = this.props.loginUserStore.userType === USER_TYPE.PATIENT;
    let programEndDate, programStartDate;

    if (isPatient) {
      programEndDate = moment(userAccountStore.programEndDate);
      programStartDate = moment(userAccountStore.programStartDate);
    } else {
      programEndDate = moment();
      programStartDate = moment();
    }

    return (
      <Query
        query={UserQueries.GetProfile}
        variables={{ userId }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data }) => {
          if (data && data.getProfile) {
            this.props.userAccountStore.setUserData(data.getProfile);
          }
          return (
            <View style={[styles.boxWithShadow, styles.container]}>
              <View style={styles.blockContainer}>
                <View style={[styles.cardHeader, {}]}>
                  <Text style={[styles.nameStyle, { flex: 1 }]}>
                    {this.props.userAccountStore.fullName}
                  </Text>
                  <ProfileEditButton onClick={this.props.onEdit} />
                </View>

                <View style={styles.subViewContainerStyle}>
                  <ProfileSubInfo text={userAccountStore.displayAge} />
                  <ProfileSubInfo text={userAccountStore.gender} />
                  {isPatient && (
                    <ProfileSubInfo
                      text={userAccountStore.displayHeightWithUnit}
                    />
                  )}
                </View>
                <ProfileSubInfo text={userAccountStore.email} />
                <ProfileSubInfo text={userAccountStore.phoneNumber} />
              </View>

              <View style={styles.horizontalSeparator} />

              {isPatient && (
                <ProgramProgressSection
                  programStartDate={programStartDate}
                  programEndDate={programEndDate}
                />
              )}
            </View>
          );
        }}
      </Query>
    );
  }
}

const ProfileSubInfo = ({ text }) => (
  <Text style={styles.subInfoTextStyle}>{text}</Text>
);

const ProgramProgressSection = ({ programStartDate, programEndDate }) => {
  const progress = AppUtil.progressReport(programEndDate, programStartDate);

  return (
    <View style={styles.blockContainer}>
      <Text style={styles.weightLossPrgramHeaderStyle}>
        {strings("profile.weight_loss_program")}
      </Text>

      <Text style={styles.weightProgramEndStyle}>
        {strings("profile.ending_on")} {programEndDate.format("DD MMMM YYYY")}
      </Text>

      <View style={{ marginVertical: 8 }}>
        <Progress.Bar
          borderWidth={0}
          color={"#024481"}
          unfilledColor={"#E7F3FB"}
          progress={progress}
          height={5}
          borderRadius={4.5}
          width={Dimensions.get("window").width - 64}
        />
      </View>
    </View>
  );
};

const ProfileEditButton = ({ onClick }) => (
  <View style={{ width: 40 }}>
    <TouchableOpacity onPress={onClick}>
      <Text style={[styles.editTextStyle, {}]}>{strings("profile.edit")}</Text>
    </TouchableOpacity>
  </View>
);
