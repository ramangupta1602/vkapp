import React from "react";
import { Text, ActivityIndicator, View, TouchableOpacity } from "react-native";
import { Mutation } from "react-apollo";
import { STATUS_VIDEO } from "Library/Constants";
import { styles } from "./styles";
import * as VideoQueries from "AppSyncQueries/VideoQueries";

export const ShowHideVideo = (props) => {
  if (props.status == STATUS_VIDEO.SHOW) {
    return isVideoHidden(props);
  }
  return isVideoEnable(props);
};

const isVideoHidden = (props) => {
  return (
    <Mutation mutation={VideoQueries.HideVideo}>
      {(hideVideo, { loading, error, data }) => {
        return returnActivateDeactivateButton(
          hideVideo,
          loading,
          "Hide",
          props
        );
      }}
    </Mutation>
  );
};

const isVideoEnable = (props) => {
  return (
    <Mutation mutation={VideoQueries.ShowVideo}>
      {(enableVideo, { loading, error, data }) => {
        return returnActivateDeactivateButton(
          enableVideo,
          loading,
          "Show",
          props
        );
      }}
    </Mutation>
  );
};

const returnActivateDeactivateButton = (hideShow, loading, text, props) => {
  return (
    <TouchableOpacity
      disabled={loading}
      onPress={() => {
        hideShow({
          variables: {
            userId: props.userId,
            archiveId: props.archiveId,
          },
          refetchQueries: [
            {
              query: VideoQueries.VideoCallList,
              variables: {
                userId: props.userId,
              },
            },
          ],
        });
      }}>
      {!loading && <Text style={styles.visiblityText}>{text}</Text>}
      {loading && (
        <View style={{ marginRight: 10 }}>
          <ActivityIndicator size="small" color={"#1072E0"} />
        </View>
      )}
    </TouchableOpacity>
  );
};
