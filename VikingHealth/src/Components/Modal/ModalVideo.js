import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { R } from "Resources";
import { styles } from "./style";

export const ModalVideo = (props) => {
  const _onVideoCallClicked = () => {
    props.dismiss();
    props.navigation.navigate("FetchVideoSessionInfo", {
      userId: props.userId,
      isAdmin: props.isAdmin,
      name: props.fullName,
    });
  };

  const _onViewCallClicked = () => {
    props.dismiss();
    props.navigation.navigate("VideoCallList", {
      userId: props.userId,
      isAdmin: props.isAdmin,
      firstName: props.firstName,
    });
  };

  return (
    <View>
      <Modal animationType="none" transparent visible={props.isModalVisible}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.dismiss();
          }}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <VideoOptionButton
            icon={R.Images.receiveVideo}
            title={"Video call"}
            onClick={_onVideoCallClicked}
          />
          <VideoOptionButton
            icon={R.Images.viewVideo}
            title={"View calls"}
            onClick={_onViewCallClicked}
          />
        </View>
      </Modal>
    </View>
  );
};

const VideoOptionButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onClick}>
      <Image source={props.icon} style={{ height: 62, width: 62 }} />
      <Text style={styles.modalText}>{props.title}</Text>
    </TouchableOpacity>
  );
};
