import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Query } from 'react-apollo';
import * as VideoQueries from 'AppSyncQueries/VideoQueries';
import { R } from 'Resources';
import { VideoView } from './VideoView';
import { HeaderView } from './HeaderView';
import AppUtil from 'Library/Utils/AppUtil';
// import { Sentry } from 'react-native-sentry';

export class FetchVideoSessionInfo extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    publishAudio: true,
    cameraPosition: 'front',
    publishVideo: true,
    text: 'Waiting for the call to connect...',
  };

  constructor(props) {
    super(props);
    const { navigation } = props;
    this.userId = navigation.getParam('userId', 'no-userid');
    this.isAdmin = navigation.getParam('isAdmin', false);
    this.name = navigation.getParam('name', 'User');
    this.eventCallBack = navigation.getParam('eventCallBack', null);

    if (!this.isAdmin) {
      this.name = 'Doctor';
    }

    // this.apiKey = '46259082'; //debug api key
    this.apiKey = '46259072'; // production api key
  }

  // Alert will be shown when there is an error while fetching token from server
  showAlert = (message) => {
    AppUtil.alertWithOkText('error', message, this.goBack);
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: R.Colors.COLOR_VIDEO_BACKGROUND }}
      >
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Query
            query={VideoQueries.TokenForVideoCall}
            variables={{ userId: this.userId }}
            fetchPolicy='network-only'
          >
            {({ loading, error, data }) => {
              console.log('data is', data, error);

              //once video information is fetched successfully will render Video calling view
              if (loading) {
                return (
                  <ActivityIndicator
                    size='large'
                    color={R.Colors.COLOR_WHITE}
                  />
                );
              } else if (error) {
                // Sentry.captureMessage(error.message);
                this.showAlert('Something went wrong');
                return null;
              } else if (data.tokenForVideoCall.httpStatus == 200) {
                const videoData = data.tokenForVideoCall.data;
                return (
                  <VideoView
                    sessionId={videoData.sessionId}
                    token={videoData.token}
                    apiKey={this.apiKey}
                    isAdmin={this.isAdmin}
                    name={this.name}
                    disconnectSession={this.goBack}
                    eventCallBack={this.eventCallBack}
                  />
                );
              }
              this.showAlert(data.tokenForVideoCall.errorMessage);
              return null;
            }}
          </Query>
        </View>
        <HeaderView navigation={this.props.navigation} />
      </View>
    );
  }
}
