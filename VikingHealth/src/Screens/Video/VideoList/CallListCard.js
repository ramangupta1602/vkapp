import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import * as DateUtil from "Library/Utils/DateUtil";
import { ShowHideVideo } from "./ShowHideVideo";
import { STATUS_VIDEO } from "Library/Constants";

export default class CallListCard extends Component {
  _onPress = () => {
    this.props.onSelectVideo(this.props.item);
  };

  render() {
    const { isAdmin } = this.props;
    const { createdAt, duration, status } = this.props.item;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={{ flex: 1 }}>
          <View
            style={[
              styles.containerCard,
              status == STATUS_VIDEO.SHOW
                ? styles.backgroundWhite
                : styles.backgroundGrey,
            ]}>
            <View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.dateTime}>
                  {DateUtil.VideoDateFormatted(createdAt)}
                </Text>
                {isAdmin && (
                  <TouchableOpacity>
                    <View style={styles.visiblityText}>
                      <ShowHideVideo
                        status={status}
                        userId={this.props.item.userId}
                        archiveId={this.props.item.archiveId}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.duration}>
                Duration: {DateUtil.DurationFormat(duration)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
