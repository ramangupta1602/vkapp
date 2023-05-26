import React, { Component } from 'react';
import { View } from 'react-native';
import { R } from 'Resources';
import { styles } from './styles';
import { BackButton, PageInfo, PageTitle } from 'Components';
import { FetchCallListQuery } from './FetchCallList';

export class VideoCallList extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.firstName = this.props.navigation.getParam('firstName', '');
    this.isAdmin = this.props.navigation.getParam('isAdmin', false);
    this.userId = this.props.navigation.getParam('userId', 'no-user');
  }

  _onSelectVideo = video => {
    const storageKey = video.storageKey;
    this._gotoVideoCall(storageKey);
  };

  _gotoVideoCall = storageKey => {
    this.props.navigation.navigate('VideoPlayer', {
      storageKey
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={[
            R.AppStyles.headerContainer,
            { backgroundColor: 'white', paddingBottom: 10 }
          ]}
        >
          <View style={styles.container}>
            <BackButton navigation={this.props.navigation} />
            <PageInfo info={'Weight Loss Program'} />
          </View>
          <PageTitle title={`${this.firstName}'s call history`} />
        </View>
        <View style={styles.listContainer}>
          <CallList
            userId={this.userId}
            isAdmin={this.isAdmin}
            onSelectVideo={this._onSelectVideo}
          />
        </View>
      </View>
    );
  }
}

const CallList = ({ userId, isAdmin, onSelectVideo }) => (
  <FetchCallListQuery
    userId={userId}
    isAdmin={isAdmin}
    onSelectVideo={onSelectVideo}
  />
);
