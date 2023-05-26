import React from "react";
import { View, Text } from "react-native";
import Modal from "react-native-modal";
import { strings } from "../../../utility/locales/i18n";
import { ProgressBarButton } from "Components";
import { styles as style } from "./styles";

const ConfirmationModal = ({
  username,
  buttonState,
  onCancelCallback,
  onConfirmCallback,
  isVisible,
  onModalHide,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      style={style.modalStyle}
      onModalHide={onModalHide}
      onBackdropPress={onCancelCallback}
    >
      <View style={style.containerStyle}>
        <Text style={[style.confirmTextStyle]}>
          {strings("confirmation_modal.confirmation")}
        </Text>

        <Text style={[style.confirmationMessage]}>
          {strings("confirmation_modal.message_1")}

          <Text style={[style.messageBold]}>Reload</Text>
          <Text> {strings("confirmation_modal.message_2")}</Text>
          <Text style={[style.messageBold]}>{username}?</Text>
        </Text>

        <ProgressBarButton
          style={[style.progressStyle]}
          label={strings("confirmation_modal.confirm")}
          isEnabled
          buttonState={buttonState}
          onClick={onConfirmCallback}
        />

        <Text style={style.cancelTextStyle} onPress={onCancelCallback}>
          {strings("confirmation_modal.cancel")}
        </Text>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
