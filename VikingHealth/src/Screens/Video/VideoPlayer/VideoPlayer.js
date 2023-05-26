import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Query } from 'react-apollo';
import { R } from 'Resources';
import { BackButton, PageTitle } from 'Components';
import * as VideoQueries from 'AppSyncQueries/VideoQueries';
import Video from 'react-native-video';
import { styles } from './styles';

export class VideoPlayer extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.storageKey = this.props.navigation.state.params.storageKey;
    this.state = { isVideoLoading: true };
  }

  _onVideoLoad = () => {
    this.setState({ isVideoLoading: false });
  };

  render() {
    const { isVideoLoading } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: R.Colors.COLOR_APP_BACKGROUND }}>
        <View style={styles.headerWrapper}>
          <View style={styles.container}>
            <BackButton navigation={this.props.navigation} />
          </View>
          <PageTitle title={'Video'} />
        </View>
        <Query
          query={VideoQueries.VideoPresignedURL}
          variables={{ videoKey: this.storageKey }}
          fetchPolicy='network-only'
        >
          {({ loading, error, data }) => {
            if (loading) {
              return (
                <View style={{ flex: 1 }}>
                  <LoadingIndicator />
                </View>
              );
            } else if (error) {
              console.log('VideoQueries.VideoPresignedURL error: ', error);
              return null;
            } else if (data && data.getVideoUrl && data.getVideoUrl.url) {
              return (
                <View style={{ flex: 1 }}>
                  <VideoPlayerObject
                    videoURL={data.getVideoUrl.url}
                    onVideoLoad={this._onVideoLoad}
                  />
                  {isVideoLoading && <LoadingIndicator />}
                </View>
              );
            }
          }}
        </Query>
      </View>
    );
  }
}

const VideoPlayerObject = ({ videoURL, onVideoLoad }) => (
  <Video
    source={{ uri: videoURL }}
    controls
    fullscreen
    allowsExternalPlayback
    bufferConfig={{
      minBufferMs: 15000,
      maxBufferMs: 50000,
      bufferForPlaybackMs: 2500,
      bufferForPlaybackAfterRebufferMs: 5000
    }}
    rate={1}
    pictureInPicture
    resizeMode={'contain'}
    useTextureView={false}
    style={styles.video}
    resizeMode={'contain'}
    onLoad={onVideoLoad}
  />
);

const LoadingIndicator = () => (
  <View style={styles.activityIndicator}>
    <ActivityIndicator size='large' color='black' />
  </View>
);
