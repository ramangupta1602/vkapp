import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  StyleSheet
} from 'react-native';
import { R } from 'Resources';

export class VideoControls extends Component {
  state = {
    publishAudio: true,
    cameraPosition: 'front',
    publishVideo: true
  };

  //user can swtich his camera mode from here
  switchCamera = () => {
    let cameraPosition = this.state.cameraPosition;
    if (cameraPosition === 'rear') {
      cameraPosition = 'front';
    } else {
      cameraPosition = 'rear';
    }
    this.setState({ cameraPosition });

    if (this.props.switchCamera) {
      this.props.switchCamera(cameraPosition);
    }
  };

  //User can turn on/off his video
  disabledPublisher = () => {
    const publishVideo = !this.state.publishVideo;
    this.setState({ publishVideo });

    if (this.props.disabledPublisher) {
      this.props.disabledPublisher(publishVideo);
    }
  };

  // user can mute and unmute his video
  muteAudio = () => {
    const publishAudio = !this.state.publishAudio;
    this.setState({ publishAudio });

    if (this.props.muteAudio) {
      this.props.muteAudio(publishAudio);
    }
  };

  disconnectSession = () => {
    if (this.props.disconnectSession) {
      this.props.disconnectSession();
    }
  };

  render() {
    const audioEnabled = this.state.publishAudio;
    const audioIcon = audioEnabled
      ? R.Images.voiceCallIcon
      : R.Images.voiceCallMute;

    const videoEnabled = this.state.publishVideo;
    const videoIcon = videoEnabled
      ? R.Images.videoCallIcon
      : R.Images.videoCallMuteIcon;

    const switchCameraIcon =
      this.state.cameraPosition === 'front'
        ? R.Images.frontCamera
        : R.Images.frontCameraMute;

    return (
      <View style={styles.bottomViewStyle}>
        <EndCallButton onClick={this.disconnectSession} />
        <ImageBackground
          source={R.Images.bottomBlackOverlay}
          style={styles.bottomOverlay}
        >
          <View style={styles.controlButtonsContainer}>
            <ControlButton
              icon={switchCameraIcon}
              onClick={this.switchCamera}
              disabled={!videoEnabled}
              style={{ opacity: videoEnabled ? 1.0 : 0.3 }}
            />

            <ControlButton icon={audioIcon} onClick={this.muteAudio} />

            <ControlButton icon={videoIcon} onClick={this.disabledPublisher} />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const ControlButton = (props = {}) => (
  <TouchableWithoutFeedback onPress={props.onClick} disabled={props.disabled}>
    <Image style={[styles.iconStyle, props.style]} source={props.icon} />
  </TouchableWithoutFeedback>
);

const EndCallButton = props => (
  <TouchableWithoutFeedback onPress={props.onClick}>
    <Image style={styles.endCallButton} source={R.Images.endCall} />
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  bottomViewStyle: {
    width: '100%',
    bottom: 0,
    position: 'absolute',
    alignItems: 'center'
  },
  iconStyle: {
    padding: 10,
    resizeMode: 'contain',
    width: 24,
    height: 24
  },
  bottomOverlay: {
    width: '100%'
  },
  endCallButton: {
    resizeMode: 'contain',
    width: 72,
    height: 72
  },
  controlButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 95,
    flex: 1
  }
});
