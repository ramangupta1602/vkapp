import React, { Component } from 'react';
import { View } from 'react-native';
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';
import { styles } from './styles';
import { VideoControls } from './VideoControls';
import { PublisherNotAvailable } from './PublisherNotAvailable';
import AppUtil from 'Library/Utils/AppUtil';
import KeepAwake from 'react-native-keep-awake';

export const VideoCallEvent = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CREATED: 'created',
  DESTROYED: 'destroyed',
  RECONNECTING: 'reconnecting',
};

export class VideoView extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    publishAudio: true,
    cameraPosition: 'front',
    publishVideo: true,
    text: 'Waiting for the call to connect...',
    isConnected: false,
  };

  constructor(props) {
    super(props);
    this.name = this.props.name;
    if (!this.props.isAdmin) {
      this.name = 'Doctor';
    }

    const { eventCallBack } = props;

    //these are events handler for session OTSession component
    //will receive call back when session is connected , disconnected or reconnecting
    this.sessionEventHandlers = {
      sessionConnected: (event) => {
        console.log('session connected', event);
        if (eventCallBack) {
          eventCallBack(VideoCallEvent.CONNECTED);
        }
      },
      sessionDisconnected: (event) => {
        this.setState({ isConnected: false, text: 'Call disconnected...' });

        if (eventCallBack) {
          eventCallBack(VideoCallEvent.DISCONNECTED);
        }
      },
      connectionCreated: (event) => {
        this.setState({ isConnected: true, text: 'Call connected.' });

        if (eventCallBack) {
          eventCallBack(VideoCallEvent.CREATED);
        }
      },
      connectionDestroyed: (event) => {
        this.setState({
          isConnected: false,
          text: `${this.name} is disconnected. Please check your internet connection and rejoin.`,
        });

        if (eventCallBack) {
          eventCallBack(VideoCallEvent.DESTROYED);
        }
      },
      sessionReconnecting: (event) => {
        this.setState({ isConnected: false, text: 'Reconnecting...' });

        if (eventCallBack) {
          eventCallBack(VideoCallEvent.RECONNECTING);
        }
      },
    };
  }

  _switchCameraPosition = (cameraPosition) => {
    this.setState({ cameraPosition });
  };

  _toggleVideoPublish = (publishVideo) => {
    this.setState({ publishVideo });
  };

  _toggleAudioPublish = (publishAudio) => {
    this.setState({ publishAudio });
  };

  _disconnectSession = () => {
    if (this.props.disconnectSession) {
      this.props.disconnectSession();
    }
  };

  showAlert = (message) => {
    AppUtil.alertWithOkText('error', message, this.goBack);
  };

  goBack = () => {
    this.props.disconnectSession();
  };

  render() {
    return (
      <View style={styles.container}>
        <KeepAwake />
        <OTSession
          ref={(ref) => {
            this.OTSession = ref;
          }}
          eventHandlers={this.sessionEventHandlers}
          apiKey={this.props.apiKey}
          sessionId={this.props.sessionId}
          token={this.props.token}
        >
          <OTSubscriber
            style={{
              width: '100%',
              height: '100%',
            }}
          />

          <View style={styles.publisherContainer}>
            <OTPublisher
              properties={{
                publishAudio: this.state.publishAudio,
                cameraPosition: this.state.cameraPosition,
                publishVideo: this.state.publishVideo,
              }}
              style={styles.publisherStyle}
            />
          </View>

          {!this.state.isConnected && (
            <PublisherNotAvailable text={this.state.text} />
          )}
          <VideoControls
            switchCamera={this._switchCameraPosition}
            disabledPublisher={this._toggleVideoPublish}
            muteAudio={this._toggleAudioPublish}
            disconnectSession={this._disconnectSession}
          />
        </OTSession>
      </View>
    );
  }
}
