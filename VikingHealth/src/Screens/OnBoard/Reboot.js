import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  Alert
} from 'react-native';
import { styles } from './Styles';
import { strings } from '../../utility/locales/i18n';
import TypesOfProgram from './TypesOfProgram';
import ProgramSummary from './ProgramSummary';
import { R } from 'Resources';
import { LocalNotification } from 'Components';
import {
  BackButton,
  PageTitle,
  SubTitle,
  PageInfo,
  CTAButton
} from 'Components';
import * as DateUtil from 'Library/Utils/DateUtil';
import AppUtil from 'Library/Utils/AppUtil';
import { RebootDetails } from './RebootDetails';
import { inject, observer } from 'mobx-react';
import { Mutation } from 'react-apollo';
import * as UserQueries from 'AppSyncQueries/UserQueries';
// import { Sentry } from 'react-native-sentry';
import { checkInternetConnection } from 'react-native-offline';

@inject('userAccountStore')
@observer
export class Reboot extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.localNotification = new LocalNotification();
  }
  state = { isRebootDetailsVisible: false };
  programsData = [
    strings('onboard.high_calorie_food_desc'),
    strings('onboard.low_calorie_diet'),
    strings('onboard.lock_weight_desc')
  ];

  programSummary = [
    {
      text: strings('onboard.weight_measurement'),
      icon: R.Images.weighMeasurementIcon,
      measurementTime: strings('onboard.daily')
    },
    {
      text: strings('onboard.body_measurement'),
      icon: R.Images.bodyMeasurementIcon,
      measurementTime: strings('onboard.weekly')
    },
    {
      text: strings('onboard.days_performance'),
      icon: R.Images.dayPerformanceIcon,
      measurementTime: strings('onboard.daily')
    }
  ];

  scheduleLocalNotification = () => {
    const dateObj = new Date();
    const newdate = DateUtil.getDate(dateObj);
    const endProgramDate = this.props.userAccountStore.programEndDate;

    const startProgramDate = this.props.userAccountStore.programStartDate;
    if (newdate <= endProgramDate) {
      this.localNotification.scheduleLocalNotification(
        endProgramDate,
        startProgramDate
      );
      this.localNotification.scheduleBodyMeasurementLocalNotification();
    }
  };

  gotoHomeScreen() {
    this.scheduleLocalNotification();
    this.props.navigation.dispatch(AppUtil.resetAction('Dashboard', {}));
  }

  startClick() {
    const params = {
      isStepTextShown: true
    };
    this.scheduleLocalNotification();
    this.props.navigation.navigate('LogWeight', params);
  }

  renderTypesOfProgram() {
    return this.programsData.map(data => {
      return <TypesOfProgram text={data} icon={R.Images.checkmark} />;
    });
  }

  renderProgramSummary() {
    const data = this.programSummary;
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <ProgramSummary
              text={data[0].text}
              icon={data[0].icon}
              measurementTime={data[0].measurementTime}
            />
          </View>
          <View style={{ flex: 0.2 }} />
          <View style={{ flex: 1 }}>
            <ProgramSummary
              text={data[1].text}
              icon={data[1].icon}
              measurementTime={data[1].measurementTime}
            />
          </View>
        </View>
        <View style={{ marginTop: 2 }}>
          <ProgramSummary
            text={data[2].text}
            icon={data[2].icon}
            measurementTime={data[2].measurementTime}
          />
        </View>
      </View>
    );
  }

  openRebootDetails() {
    return (
      <Modal
        animationType='slide'
        transparent
        visible={this.state.isRebootDetailsVisible}
      >
        <RebootDetails
          onCrossClicked={() => {
            this.setState({ isRebootDetailsVisible: false });
          }}
        />
      </Modal>
    );
  }

  renderViewDetails() {
    return (
      <View style={{ position: 'absolute', right: 0 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ isRebootDetailsVisible: true });
          }}
        >
          <Text style={styles.viewDetails}>
            {strings('onboard.view_detail')}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    const shouldShowBackButton = this.props.navigation.getParam(
      'isBackButtonVisible',
      false
    );

    const userId = this.props.userAccountStore.username;
    const startDate = DateUtil.formattedTodayDate();
    const endDate = DateUtil.addWeekFormatted(startDate, 12);

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: R.Colors.COLOR_APP_BACKGROUND }}
      >
        <View style={styles.container}>
          {this.openRebootDetails()}
          <View style={{ marginLeft: 8 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'flex-start' }}
            >
              {shouldShowBackButton && (
                <BackButton navigation={this.props.navigation} />
              )}
              <PageInfo info={strings('onboard.weight_loss_program')} />
            </View>
            <View
              style={{
                marginRight: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              {this.renderViewDetails()}
              <PageTitle title={strings('onboard.reboot')} />
            </View>
            <View style={{ marginRight: 20 }}>
              <SubTitle subTitle={strings('onboard.onboard_description')} />
            </View>
          </View>
          <View style={styles.secondContainer}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Lato-Regular',
                lineHeight: 17,
                color: R.Colors.COLOR_TEXT
              }}
            >
              {strings('onboard.during_the_program')}
            </Text>

            {this.renderTypesOfProgram()}

            <Text style={[styles.title, { paddingTop: 20 }]}>
              {strings('onboard.program_summary')}
            </Text>

            {this.renderProgramSummary()}

            <Mutation
              mutation={UserQueries.UpdateProgramDates}
              onError={error => {
                // Sentry.captureMessage(error.message);
                Alert.alert(
                  'Alert!',
                  'Unable to process your request. Please try again later'
                );
              }}
            >
              {(updateProgramDates, { data, error, loading }) => {
                return (
                  <CTAButton
                    onClick={() => {
                      checkInternetConnection().then(isConnected => {
                        if (isConnected === true) {
                          updateProgramDates({
                            variables: {
                              userId,
                              endDate,
                              startDate
                            }
                          });
                        } else {
                          Alert.alert(
                            'No Internet Connection',
                            'It seems there is some problem with your internet connection. Please check and try again.'
                          );
                        }
                      });
                    }}
                    label={strings('common_message.start_caps')}
                    isEnabled
                    style={{ marginTop: 28 }}
                  />
                );
              }}
            </Mutation>

            {/* <TouchableWithoutFeedback
              onPress={() => {
                this.gotoHomeScreen();
              }}
            >
              <Text style={styles.startLater}>
                {strings('onboard.i_will_start_later')}
              </Text>
            </TouchableWithoutFeedback> */}
          </View>
        </View>
      </ScrollView>
    );
  }
}
