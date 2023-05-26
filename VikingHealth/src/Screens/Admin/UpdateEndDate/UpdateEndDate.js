import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import {
  BackButton,
  PageInfo,
  PageTitle,
  DatePicker,
  ProgressBarButton
} from 'Components';
import * as DateUtil from 'Library/Utils/DateUtil';
import { R } from 'Resources';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import AppUtil from 'Library/Utils/AppUtil';
import { HeightWeightUtil } from 'Library/Utils/HeightWeightUtil';
import { inject, observer } from 'mobx-react';
import { RandomColors } from '../../../Components/RandomColors';
import { STATUS_USER } from 'Library/Constants';
import { Mutation, Query } from 'react-apollo';
import { ButtonState } from 'Components/CTAButton/ButtonState';
import * as UserQueries from 'AppSyncQueries/UserQueries';
import { styles } from './Styles';
import { colors } from 'react-native-elements';

@inject('userAccountStore')
@observer
export class UpdateEndDate extends Component {
  static navigationOptions = {
    title: 'Nothing',
    header: null
  };

  constructor(props) {
    super(props);
    this.isAdmin = this.props.navigation.getParam('isAdmin', false);
    this.userId = this.props.navigation.getParam('userId', 0);
    this.status = this.props.navigation.getParam('status', 0);
    this.programStartDate = this.props.navigation.getParam(
      'programStartDate',
      AppUtil.getCurrentDate()
    );
    this.age = this.props.navigation.getParam('age', 0);
    this.height = this.props.navigation.getParam('height', '');

    const endDate = AppUtil.convertDateFormatMMMMDDYYYY(
      this.props.navigation.getParam('programEndDate', AppUtil.getCurrentDate())
    );

    this.state = {
      endDate: endDate
    };
  }
  isEndDateLesserThanStartDate() {
    const startDate = AppUtil.convertDateFormatMMMMDDYYYY(
      this.programStartDate
    );
    const diffDays = DateUtil.differenceInDays(startDate, this.state.endDate);
    if (diffDays <= 0) {
      return true;
    }
    return false;
  }

  getHeight(height, heightUnit) {
    return HeightWeightUtil.formattedHeightText(height, heightUnit);
  }
  onDateSelected(date) {
    this.setState({ endDate: date });
  }

  updateEndDate = (proxy, { data: { updateProfile } }) => {
    const updatedDate = AppUtil.convertDateFormatYYYYMMDD(this.state.endDate);

    this.props.userAccountStore.programEndDate = updatedDate;
    /**
     * this is going to perform if user is admin
     * if user is admin then dashboard list will be update with new information
     */
    if (this.isAdmin) {
      const query = UserQueries.PatientList;
      let data;
      try {
        data = proxy.readQuery({
          query: query,
          variables: {
            limit: 10,
            nextToken: null,
            type: this.status
          }
        });
      } catch (e) {
      }
      if (data && data.patientsList && data.patientsList.patients) {
        let patientList = data.patientsList.patients;
        let currentUser = patientList.filter(
          object => object.userId == this.userId
        );

        if (currentUser) {
          let currentUserData = currentUser[0];
          currentUserData.programEndDate = updatedDate;
          let index = patientList.map(o => o.userId).indexOf(this.userId);
          data.patientsList.patients[index] = currentUserData;
          proxy.writeQuery({ query: query, data });
        }
      }
    }
  };

  goBack() {
    setTimeout(() => {
      this.props.navigation.goBack();
    }, 1000);
  }

  renderButton() {
    return (
      <Mutation mutation={UserQueries.UpdateProgramEndDate}>
        {(updateEndDate, { loading, error, data }) => {
          let buttonLabel = 'UPDATE';
          let buttonState = ButtonState.Idle;
          if (data) {
            buttonState = ButtonState.Success;
            buttonLabel = 'UPDATED SUCCESSFULLY';
            this.goBack();
          } else if (error) {
            buttonState = ButtonState.Idle;
            buttonLabel = 'Update';
          } else if (loading) {
            buttonState = ButtonState.Progress;
          }
          return (
            <View
              style={{
                alignSelf: 'center',
                position: 'absolute',
                bottom: 30,
                width: '80%'
              }}
            >
              <ProgressBarButton
                disabled={buttonState === ButtonState.Progress}
                label={buttonLabel}
                buttonState={buttonState}
                onClick={() => {
                  if (this.isEndDateLesserThanStartDate()) {
                    AppUtil.alertWithOkText(
                      'Error',
                      "End date can't be smaller than start date",
                      null
                    );
                    return;
                  }

                  updateEndDate({
                    variables: {
                      date: AppUtil.convertDateFormatYYYYMMDD(
                        this.state.endDate
                      ),
                      userId: this.userId
                    },
                    update: this.updateEndDate
                  });
                }}
              />
            </View>
          );
        }}
      </Mutation>
    );
  }

  render() {
    let detail = this.props.userAccountStore;
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.contentAlign}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <BackButton navigation={this.props.navigation} />
              <PageInfo info={'Weight Loss Program'} />
            </View>
          </View>
          <View style={{ marginLeft: 8 }}>
            <PageTitle title={'Edit Program end date'} />
          </View>
          <View style={styles.cardHeader}>
            <RandomColors
              gender={detail.gender}
              height={62}
              width={62}
              number={''}
            />
            <View>
              <Text style={styles.nameStyle}>
                {detail.firstName} {detail.lastName}
              </Text>
              <View style={styles.subInfo}>
                {this.status !== STATUS_USER.INVITED && (
                  <Text style={styles.subInfoTextStyle}>
                    {this.age}
                    {'   |   '}
                    {this.height}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 30, marginLeft: 24, marginRight: 20 }}>
          <Text style={styles.startDateLabel}>Start date</Text>
          <Text style={styles.startDateText}>
            {AppUtil.convertDateFormatMMMMDDYYYY(this.programStartDate)}
          </Text>
          <View
            style={{
              backgroundColor: '#E3E7EB',
              height: 1,
              width: '100%',
              marginTop: 5
            }}
          />
          <DatePicker
            style={{ marginTop: 60, marginBottom: 15 }}
            date={this.state.endDate}
            mode='date'
            confirmBtnText='Done'
            cancelBtnText='Cancel'
            placeholder={'End date'}
            format='MMMM DD, YYYY'
            showIcon={false}
            ref={this.dobInput}
            customStyles={{
              placeholderText: styles.placeholder,
              dateInput: { flex: 1 }
            }}
            onDateChange={date => {
              this.onDateSelected(date);
            }}
          />
        </View>
        {this.renderButton()}
      </View>
    );
  }
}
