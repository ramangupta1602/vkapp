import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './Styles';
import { R } from 'Resources';
import { strings } from '../../../utility/locales/i18n';

export class EmptyState extends Component {
  constructor(props) {
    super(props);
    this.img = R.Images.emptyActive;
    this.text = strings('empty_state.active');
    this.info = strings('empty_state.infoactive');
  }

  render() {
    if (this.props.query === 0) {
      this.img = R.Images.emptyInvite;
      this.text = strings('empty_state.invited');
      this.info = strings('empty_state.infoinvited');
    } else if (this.props.query === 1) {
      this.img = R.Images.emptyActive;
      this.text = strings('empty_state.active');
      this.info = strings('empty_state.infoactive');
    } else if (this.props.query === 2) {
      this.img = R.Images.emptyComplete;
      this.text = strings('empty_state.complete');
      this.info = strings('empty_state.infocomplete');
    }

    return (
      <View style={styles.wrapper}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Image source={this.img} style={styles.images} />
        </View>
        <Text style={styles.emptyText}>{this.text}</Text>
        <Text style={styles.emptyTextInfo}>{this.info}</Text>
        {this.props.query === 0 && (
          <TouchableOpacity
            style={styles.invitePatient}
            onPress={() => this.props.onClick()}
          >
            <Text style={styles.inviteText}> ADD NEW PATIENT</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
