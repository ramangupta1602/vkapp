import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as DateUtil from 'Library/Utils/DateUtil';
import { styles } from './CardStyles';
import { R } from 'Resources';
import { Mutation } from 'react-apollo';
import * as UserQueries from 'AppSyncQueries/UserQueries';
import { RandomColors } from 'Components';
import { Logger } from 'aws-amplify';
import { STATUS_USER } from 'Library/Constants';
import AppUtil from 'Library/Utils/AppUtil';
const MAX_LIMIT_NAME = 23;
import { checkInternetConnection } from 'react-native-offline';

@inject('userAccountStore')
@observer
export class StatusInviteCard extends Component {
  CardPressed(data) {
    this.props.userAccountStore.setUserData(data);
    this.props.onClick();
  }
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.isProgress = false;
  }

  invitationSentCallback(isSuccess, errorMessage) {
    if (this.props.callback) {
      this.props.callback(isSuccess, this.props.data.phoneNumber, errorMessage);
    }
  }

  /**
   * render button is used for resending invitation to user
   * by clicking on resending button a progress bar will be shown instaed of button
   */
  renderButton() {
    return (
      <Mutation mutation={UserQueries.ResendInvitation}>
        {(resendInvitation, { loading, error, data }) => {
          if (data && data.resendInvitation && this.isProgress) {
            this.isProgress = false;
            if (data.resendInvitation.httpStatus == 200) {
              this.invitationSentCallback(true, '');
            } else {
              this.invitationSentCallback(
                false,
                data.resendInvitation.errorMessage
              );
            }
          } else if (error && this.isProgress) {
            this.isProgress = false;
            this.invitationSentCallback(false, 'Something went wrong');
          }
          if (!loading) {
            return (
              <View style={styles.resendContainer}>
                <View style={styles.resend}>
                  <TouchableOpacity
                    onPress={() => {
                      this.isProgress = true;
                      if (this.isProgress) {
                        checkInternetConnection().then(isConnected => {
                        if (isConnected === true) {
                          resendInvitation({
                          variables: {
                            userId: this.props.data.userId
                          },
                          refetchQueries: [
                            {
                              query: UserQueries.PatientList,
                              variables: {
                                limit: 10,
                                nextToken: null,
                                type: STATUS_USER.INVITED
                              }
                            }
                          ]
                        });
                      } else {
                          Alert.alert(
                            'No Internet Connection',
                            'It seems there is some problem with your internet connection. Please check and try again.'
                          );
                        }
                      })
                    }
                    }}
                  >
                    <Text style={styles.resendText}>Reinvite</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          } else {
            return this.renderProgressBar();
          }
        }}
      </Mutation>
    );
  }

  renderProgressBar() {
    return (
      <View style={[styles.resendContainer, { marginRight: 10 }]}>
        <ActivityIndicator size='small' color={R.Colors.COLOR_BLUE_CARDS} />
      </View>
    );
  }

  render() {
    let detail = this.props.data;
    const name = detail.firstName + ' ' + detail.lastName;

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.CardPressed(detail);
        }}
      >
        <View style={[styles.boxWithShadow, styles.container]}>
          <View style={styles.cardHeader}>
            <RandomColors
              gender={detail.gender}
              height={42}
              width={42}
              number={detail.phoneNumber}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.nameStyle}>
                {AppUtil.truncateText(name, MAX_LIMIT_NAME)}
              </Text>
              <View style={styles.subInfo}>
                <Image
                  source={R.Images.call}
                  style={{ height: 11, width: 11 }}
                />
                <Text style={styles.subInfoTextStyle}>
                  {' '}
                  {detail.phoneNumber}
                </Text>
              </View>
            </View>
            {this.renderButton()}
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <View>
              <Text style={styles.programEndStyle}>
                Invited{' '}
                {DateUtil.lastUpdatedDateFormatted(this.props.data.invitedDate)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
