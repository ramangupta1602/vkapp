import React, { Component } from 'react';
import {
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Text,
} from 'react-native';
import { styles } from './Styles';
import { strings } from '../../../utility/locales/i18n';
import AppUtil from 'Library/Utils/AppUtil';
import * as DateUtil from 'Library/Utils/DateUtil';
import { R } from 'Resources';
import Toast from 'react-native-easy-toast';
import {
  BackButton,
  PageTitle,
  SubTitle,
  CTAButton,
  Ruler,
  UnitSelection,
  ProgressBarButton,
} from 'Components';
import { inject, observer } from 'mobx-react';
import { Mutation } from 'react-apollo';
import { Query } from 'react-apollo';
import * as WeightLogQueries from 'AppSyncQueries/WeightLogQueries';
import * as UserQueries from 'AppSyncQueries/UserQueries';
import { USER_ONBOARDING_STEP, USER_TYPE } from 'Library/Constants';
import { WeightLog } from 'Library/Models/WeightLogModel';
import { checkInternetConnection } from 'react-native-offline';
// import { Sentry } from "react-native-sentry";
import { ButtonState } from 'Components/CTAButton/ButtonState';

@inject('userAccountStore', 'loginUserStore')
@observer
export class AboutYou extends Component {
  static navigationOptions = {
    title: 'Setup profile',
    header: null,
  };

  constructor(props) {
    super(props);
    this.shouldShowBackButton = this.props.navigation.getParam(
      'isBackButtonVisible',
      false
    );
    this.rulerWidth = Dimensions.get('window').width;
    let weightUnit = this.props.loginUserStore.displayWeightUnit;
    if (!weightUnit) {
      weightUnit = 0;
    }

    let weight = this.props.userAccountStore.displayTargetWeight;
    if (!weight) {
      weight = weightUnit === 0 ? 70 : 150;
    }

    this.isAdmin = this.props.loginUserStore.userType === USER_TYPE.ADMIN;
    this.userId = this.props.userAccountStore.username;
    const phoneNumber = this.props.userAccountStore.phoneNumber;

    if (!this.isAdmin) {
      if (phoneNumber && phoneNumber.startsWith('+1')) {
        weightUnit = 1;
        weight = 150;
      } else {
        weight = 70;
        weightUnit = 0;
      }
    }

    this.state = {
      selectedWeightUnit: weightUnit,
      weight,
    };
  }

  componentDidMount() {}

  _isTargetWeightValid = () => {
    if (this.lastWeightLog == null) return true;

    const weightUnit = this.state.selectedWeightUnit;
    const targetWeight = this.state.weight;
    const lastWeight = this.lastWeightLog.displayWeight(weightUnit);

    const isTargetWeightValid = targetWeight < lastWeight;
    if (!isTargetWeightValid) {
      this.refs.toast.show(
        'Your target weight can not be more than your current weight ',
        3000
      );
    }
    return isTargetWeightValid;
  };

  _targetWeightUpdated = () => {
    console.log('completed');
    this._updateStore();

    if (this.shouldShowBackButton) {
      this.props.navigation.goBack();
      return;
    }

    const { programStartDate, phase } = this.props.userAccountStore;
    const dateDiff = DateUtil.absoluteDifferenceFromToday(programStartDate);
    const routeName = AppUtil.getScreenToshow(dateDiff, phase);

    this.props.navigation.dispatch(AppUtil.resetAction(routeName, {}));
  };

  weightUpdated(value) {
    this.setState({ weight: value });
  }

  _updateWeightLog = (proxy, { data: { addTargetWeight } }) => {
    console.log('asdfgh');
    const query = UserQueries.GetProfile;
    const queryVariables = {
      userId: this.userId,
    };
    console.log(queryVariables, 'queryVariablesqueryVariables');
    try {
      let data = proxy.readQuery({
        query: query,
        variables: queryVariables,
      });
      console.log(data, 'datadatadatadatadata');
      if (data && data.getProfile) {
        data.getProfile.targetWeight = addTargetWeight.targetWeight;
        data.getProfile.weightUnit = addTargetWeight.weightUnit;
        proxy.writeQuery({
          query: query,
          variables: queryVariables,
          data,
        });
      }
      console.log('donedone');
    } catch (e) {
      console.log('EXCEPTION getProfile: ', e.message);
    }
  };

  _updateStore = () => {
    this.props.userAccountStore.targetWeight = this.state.weight;
    this.props.userAccountStore.weightUnit = this.state.selectedWeightUnit;
    /**
     * When user is Admin then this two value will not be updated
     */
    if (this.isAdmin === false) {
      this.props.loginUserStore.setDisplayWeightUnit(
        this.state.selectedWeightUnit
      );
      this.props.loginUserStore.setOnboardingStep(USER_ONBOARDING_STEP.DONE);
    }
  };

  _optimisticResponse = () => {
    return {
      __typename: 'Patient',
      userId: this.userId,
      targetWeight: this.state.weight,
      weightUnit: this.state.selectedWeightUnit,
    };
  };

  renderToast() {
    return (
      <Toast
        ref="toast"
        style={[R.ToastStyle.toastSuccessBackGround]}
        position="center"
        fadeInDuration={800}
        fadeOutDuration={1000}
        textStyle={styles.toastText}
      />
    );
  }

  render() {
    const maxValue = this.state.selectedWeightUnit === 0 ? 175.5 : 386;

    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView
          style={[styles.container, { flex: 1 }]}
          enabled
          behavior={Platform.OS === 'ios' ? 'padding' : 'margin'}
        >
          <View style={styles.container}>
            {this.renderToast()}
            <View style={R.AppStyles.headerContainer}>
              {this.shouldShowBackButton && (
                <BackButton navigation={this.props.navigation} />
              )}
              <PageTitle title={strings('aboutYou.title')} />
              <SubTitle subTitle={strings('aboutYou.subTitle')} />
              <Text>{this.state.selectedWeightUnit}</Text>
            </View>

            <Query
              query={WeightLogQueries.LastRecordedWeight}
              variables={{ userId: this.userId }}
              fetchPolicy="cache-and-network"
            >
              {({ loading, error, data }) => {
                if (data) {
                  let lastWeightLog = data.lastWeightLog;
                  if (lastWeightLog) {
                    this.lastWeightLog = new WeightLog(
                      lastWeightLog.weight,
                      lastWeightLog.date,
                      lastWeightLog.weightUnit
                    );
                  }
                }
                return null;
              }}
            </Query>

            <View
              style={{
                marginTop: 100,
                justifyContent: 'space-between',
                flex: 1,
              }}
            >
              <View>
                <Ruler
                  unit={this.state.selectedWeightUnit}
                  default={this.state.weight}
                  width={this.rulerWidth}
                  minRange={0}
                  maxRange={maxValue}
                  onValueUpdated={this.weightUpdated.bind(this)}
                />

                {!this.isAdmin && (
                  <View style={styles.measurementTabContainer}>
                    <UnitSelection
                      firstTab={strings('common_message.kg').toUpperCase()}
                      secondTab={strings('common_message.lb').toUpperCase()}
                      isFirstTabSelected={this.state.selectedWeightUnit == 0}
                      tabSelectionChanged={(index) => {
                        this.setState({ selectedWeightUnit: index });
                      }}
                    />
                  </View>
                )}
              </View>

              {/* <Mutation mutation={UserQueries.AddPatientTargetWeight}>
                {(addTargetWeight, { loading, error, data }) => {
                  return (
                    <CTAButton
                      style={{ margin: 16 }}
                      label={strings("aboutYou.done")}
                      isEnabled
                      onClick={() => {
                        if (this.state.weight.length === 0) {
                          Alert.alert("Error", "Please enter valid weight");
                          return;
                        }

                        if (parseFloat(this.state.weight) < 0.5) {
                          Alert.alert("Error", "Please enter valid weight");
                          return;
                        }

                        if (this._isTargetWeightValid() === false) return;
                        addTargetWeight({
                          variables: {
                            userId: this.userId,
                            targetWeight: this.state.weight,
                            weightUnit: this.state.selectedWeightUnit
                          },
                          optimisticResponse: {
                            __typename: "Mutation",
                            addTargetWeight: this._optimisticResponse()
                          },
                          update: this._updateWeightLog
                        });
                        this._targetWeightUpdated();
                      }}
                    />
                  );
                }}
              </Mutation> */}

              <Mutation
                mutation={UserQueries.AddPatientTargetWeight}
                onError={(error) => {
                  console.log(error, 'errorerroe');
                  //   Sentry.captureMessage(error.message);
                  Alert.alert(
                    'Alert!',
                    'We were not able to log your weight. Please try again later.'
                  );
                }}
                onCompleted={this._targetWeightUpdated}
                update={this._updateWeightLog}
                notifyOnNetworkStatusChange
              >
                {(addTargetWeight, { loading, error, data }) => {
                  let buttonState = ButtonState.Idle;
                  let buttonLabel = 'DONE';
                  if (loading) {
                    buttonState = ButtonState.Progress;
                    buttonLabel = '';
                  }
                  return (
                    <View style={styles.buttonContainer}>
                      <ProgressBarButton
                        // disabled={loading}
                        label={buttonLabel}
                        buttonState={buttonState}
                        onClick={() => {
                          if (this.state.weight.length === 0) {
                            Alert.alert('Error', 'Please enter valid date');
                            return;
                          }

                          if (parseFloat(this.state.weight) < 0.5) {
                            Alert.alert('Error', 'Please enter valid weight');
                            return;
                          }
                          if (this._isTargetWeightValid() === false) return;

                          checkInternetConnection().then((isConnected) => {
                            if (isConnected === true) {
                              console.log('1', this.state.weight);
                              addTargetWeight({
                                variables: {
                                  userId: this.userId,
                                  targetWeight: this.state.weight,
                                  weightUnit: this.state.selectedWeightUnit,
                                },
                                optimisticResponse: {
                                  __typename: 'Mutation',
                                  addTargetWeight: this._optimisticResponse(),
                                },
                              });
                            } else {
                              Alert.alert(
                                'No Internet Connection',
                                'It seems there is some problem with your internet connection. Please check and try again.'
                              );
                            }
                          });
                        }}
                      />
                    </View>
                  );
                }}
              </Mutation>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}
