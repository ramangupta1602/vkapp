import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import store from 'react-native-simple-store';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  AsyncStorage,
} from 'react-native';
import { Analytics } from 'aws-amplify';
import { BackButton, PageTitle, ProgressBarButton } from 'Components';
import { styles } from './Styles';
import { UserInfoCard } from './UserInfoCard';
import { MeasurementUnit } from './MeasurementUnit';
import { strings } from '../../utility/locales/i18n';
import { R } from 'Resources';
import AppUtil from 'Library/Utils/AppUtil';
import { inject, observer } from 'mobx-react';
import { withApollo } from 'react-apollo';
import { USER_TYPE } from 'Library/Constants';
import { CancelNotification } from 'Components';
import { checkInternetConnection } from 'react-native-offline';
import AppVersionCheck from './../../Components/AppVersionCheck/AppVersionCheck';
import { appsyncClient } from '../../../App';
import { RemoveUserToken } from '../../AppSyncQueries/UserQueries';
import * as AsyncStoreUtil from '../../utility/AsyncStoreUtil';
import { Mutation } from 'react-apollo';
import { ButtonState } from '../../Components/CTAButton/ButtonState';
// import { Sentry } from 'react-native-sentry';

@inject(
  'userAccountStore',
  'loginUserStore',
  'gamificationStore',
  'rewardStore'
)
@observer
class ProfileScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    key: 1
  }
  constructor(props) {
    super(props);

    this.appVersionCheck = new AppVersionCheck(
      this.props.userAccountStore,
      this.props.loginUserStore
    );
    this.isAdmin = this.props.loginUserStore.userType == USER_TYPE.ADMIN;
    this.cancelNotification = new CancelNotification();
  }

  componentDidMount() {
    this.appVersionCheck.updateSyncedAppVersionOnServer();
  }

  _signout = () => {
    Alert.alert(
      strings('profile.logout'),
      strings('profile.logout_message'),
      [
        {
          text: strings('common_message.yes_text'),
          onPress: () => this.clearDataAndSignOut(),
          style: 'cancel',
        },
        {
          text: strings('common_message.cancel_text'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  clearDataAndSignOut = async () => {
    const token = await AsyncStoreUtil.getDataWithKey(
      AsyncStoreUtil.AsyncStoreKeys.TOKEN
    );
    const { userId } = this.props.loginUserStore;

    console.log(userId);

    checkInternetConnection().then((isConnected) => {
      if (isConnected === true) {
        appsyncClient
          .mutate({
            mutation: RemoveUserToken,
            variables: {
              user_id: userId,
              token: token ?? '',
            },
          })
          .then((data) => {
            console.log('data is', data);
            this.signoutFromApolloClient();
          })
          .catch((err) => {
            console.log('error is', error);
            Alert.alert(strings('common_message.error'), err);
          });

        // this.signoutFromApolloClient();
      } else {
        Alert.alert(
          'No Internet Connection',
          'It seems there is some problem with your internet connection. Please check and try again.'
        );
      }
    });
  };

  signoutFromApolloClient = () => {
    Auth.signOut()
      .then((data) => {
        this.props.client.clearStore();
        this.cancelNotification.disableAllLocalNotification(); //all the notifications cancelled
        this.props.navigation.dispatch(AppUtil.resetAction('Login', {}));
        Analytics.record({
          name: 'Logout successfull',
        });
        setTimeout(() => {
          this.clearStores();
        }, 100);
      })
      .catch((err) => Alert.alert(strings('common_message.error'), err));
  };

  clearStores() {
    this.props.loginUserStore.clear();
    this.props.userAccountStore.clearData();
    this.props.gamificationStore.clearData();
    this.props.rewardStore.clearData();

    store.delete('cancelDate');
    AsyncStorage.removeItem(AsyncStoreUtil.AsyncStoreKeys.APPOINTMENT_COUNT);
  }

  _updateTargetWeight = () => {
    const params = {
      isBackButtonVisible: true,
    };
    this.props.navigation.navigate('AboutYou', params);
  };

  _editProfile = () => {
    this.props.navigation.navigate('Signup', {
      isBackButtonVisible: true,
    });
  };

  _gotoChangePassword = () => {
    this.props.navigation.navigate('ChangePassword');
  };

  goToSummaryPage = () => {
    this.props.navigation.navigate('CycleSummary');
  };

  render() {
    const weight = `${this.props.userAccountStore.displayTargetWeight} ${this.props.loginUserStore.weightUnitText}`;
    const appVersion = this.appVersionCheck.getLocalAppVersionString();

    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <View style={R.AppStyles.headerContainer}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'flex-start' }}
              >
                <BackButton navigation={this.props.navigation} />
                {this.shouldShowPageInfo && (
                  <PageInfo info={strings('log_weight.step1outof3')} />
                )}
              </View>
              <PageTitle title={strings('profile.profile')} />
            </View>

            {/* User Information card */}
            <View style={{ marginLeft: 16, marginTop: 24, marginRight: 16 }}>
              <UserInfoCard onEdit={this._editProfile} />
            </View>

            {/* Measurement Card */}
            <View
              style={{
                marginTop: 24,
                marginLeft: 26,
                marginRight: 26,
              }}
            >
              <MeasurementUnit onWeightUnitChange={()=>{
                this.setState({
                  key: this.state.key + 1
                })
              }} />
            </View>

            {!this.isAdmin && (
              <TargetWeightComponent
                sectionTitle={strings('profile.target_weight')}
                sectionInfo={weight}
              />
            )}
            <ProfileSectionComponent
              sectionTitle={strings('profile.change_password')}
              onClick={this._gotoChangePassword}
            />

            <Mutation
              mutation={RemoveUserToken}
              refetchQueries={['GetLastRecordedLog']}
              onError={(error) => {
                this.isInputEnabled = true;
                // Sentry.captureMessage(error.message);
                Alert.alert(
                  'Alert!',
                  'We were not able to signout. Please try again later.'
                );
              }}
              onCompleted={() => {}}
            >
              {(removeUserToken, { loading, error }) => {
                let buttonState = ButtonState.Idle;

                if (loading) {
                  buttonState = ButtonState.Progress;
                }

                return (
                  <LogoutButton
                    buttonState={buttonState}
                    onClick={() => {
                      Alert.alert(
                        strings('profile.logout'),
                        strings('profile.logout_message'),
                        [
                          {
                            text: strings('common_message.yes_text'),
                            onPress: () => {
                              checkInternetConnection().then((isConnected) => {
                                if (isConnected === true) {
                                  AsyncStoreUtil.getDataWithKey(
                                    AsyncStoreUtil.AsyncStoreKeys.TOKEN
                                  ).then((token) => {
                                    const {
                                      userId,
                                    } = this.props.loginUserStore;

                                    removeUserToken({
                                      variables: {
                                        user_id: userId,
                                        token: token ?? '',
                                      },
                                    });
                                  });

                                  // It should be in onComplete, but because when token expire, user is not able to
                                  // complete mutation and hence signout. Therefore I am first hitting mutation to delete
                                  // token and then simultaneously signout from apollo.
                                  this.signoutFromApolloClient();
                                } else {
                                  Alert.alert(
                                    'No Internet Connection',
                                    'It seems there is some problem with your internet connection. Please check and try again.'
                                  );
                                }
                              });
                            },
                            style: 'cancel',
                          },
                          {
                            text: strings('common_message.cancel_text'),
                            style: 'cancel',
                          },
                        ],
                        { cancelable: false }
                      );
                    }}
                  />
                );
              }}
            </Mutation>

            <Text style={styles.versionTextStyle}>v{appVersion}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export const Profile = withApollo(ProfileScreen);

const ProfileSectionComponent = (props) => {
  const { sectionTitle, sectionInfo, onClick } = props;
  return (
    <React.Fragment>
      <SeparatorLine />
      <TouchableOpacity
        onPress={onClick}
        style={styles.containerWeightPassword}
      >
        <Text style={styles.weightChangePasswordStyle}>{sectionTitle}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {sectionInfo && (
            <Text style={styles.editTextStyle}>{sectionInfo}</Text>
          )}
          <Image
            source={R.Images.arrowRight}
            style={[styles.image, { marginLeft: 10 }]}
          />
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
};

const TargetWeightComponent = (props) => {
  const { sectionTitle, sectionInfo, onClick } = props;
  return (
    <React.Fragment>
      <SeparatorLine />
      <TouchableOpacity
        activeOpacity={onClick ? 0.2 : 1}
        style={styles.containerWeightPassword}
        onPress={() => {
          if (onClick) {
            onClick();
          }
        }}
      >
        <Text style={styles.weightChangePasswordStyle}>{sectionTitle}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {sectionInfo && (
            <Text style={styles.editTextStyle}>{sectionInfo}</Text>
          )}
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
};

const SeparatorLine = () => (
  <View
    style={{
      height: 2,
      marginTop: 24,
      backgroundColor: R.Colors.COLOR_LINE,
    }}
  />
);

const LogoutButton = ({ onClick, buttonState }) => (
  <ProgressBarButton
    style={styles.logoutButtonStyle}
    disabled={false}
    label={strings('profile.logout')}
    buttonState={buttonState}
    onClick={onClick}
    textStyle={{ color: '#D0444C' }}
    progressColor='#D0444C'
  />
);

{
  /* <TouchableOpacity onPress={onClick} style={[styles.logoutButtonStyle]}>
    <Text style={styles.logoutTextStyle}>{}</Text>
  </TouchableOpacity> */
}
