import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import Styles from './Styles';
import Triangle from 'react-native-triangle';
import { BottomBarContext } from '../../Context/BottomTabContext';
// import Modal from "react-native-modal";

export const Alignment = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default class ToolTipComponent extends Component {
  static contextType = BottomBarContext;

  state = {
    hasLayoutParam: false,
    layoutParam: { x: 0, y: 0, width: 0, height: 0, pageX: 0, pageY: 0 },
  };

  render() {
    const { width, height, pageX, pageY } = this.state.layoutParam;
    const { horizontalAlignment, verticalAlignment, onPress } = this.props;
    const actionTitle = 'Okay';

    return (
      <View
        style={{
          flex: 1,
          width: '100%',
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            ref={(ref) => {
              this.tabRef = ref;
            }}
            onLayout={() => {
              if (this.tabRef) {
                setTimeout(() => {
                  if (!this.tabRef) {
                    return;
                  }

                  this.tabRef.measure((x, y, width, height, pageX, pageY) => {
                    if (this.state.hasLayoutParam) {
                      return;
                    }

                    //
                    // just in case, measure fails to get dimension, we should not show popup.
                    if (width !== 0 && height !== 0) {
                      this.setState({
                        hasLayoutParam: true,
                        layoutParam: { x, y, width, height, pageX, pageY },
                      });
                    }
                  });
                }, 1000);
              }
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              width: '100%',
            }}
          >
            {this.props.children}
          </View>
        </View>

        {this.state.hasLayoutParam && (
          <Modal
            visible={this.props.shouldShowPopup}
            transparent={true}
            onDismiss={this.props.onHide}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(161,172,180,0.20)',
              }}
            >
              <View
                pointerEvents='none'
                style={{
                  position: 'absolute',
                  top: pageY,
                  left: pageX,
                  width,
                  height,
                  justifyContent: 'center',

                  // backgroundColor: '#f5f5f5',
                  backgroundColor: 'transparent',
                }}
              >
                {this.props.children}
              </View>

              <View
                style={[
                  Styles.containerStyle,
                  {
                    left: horizontalAlignment == Alignment.LEFT ? pageX : null,
                    right:
                      horizontalAlignment == Alignment.RIGHT
                        ? screenWidth - pageX - width / 2 - 15 // 15 =  half width of triangle + triangle margin horizontal
                        : null,
                    top:
                      verticalAlignment === Alignment.TOP
                        ? pageY + height
                        : null,
                    bottom:
                      verticalAlignment === Alignment.BOTTOM
                        ? screenHeight -
                          pageY +
                          (Platform.OS == 'android' ? 0 : 5)
                        : null,

                    flexDirection:
                      verticalAlignment == Alignment.BOTTOM
                        ? 'column-reverse'
                        : 'column',
                  },
                ]}
              >
                <Triangle
                  width={20}
                  height={8}
                  color={'#f5f5f5'}
                  style={{
                    zIndex: 10,
                    elevation: 10,
                    marginHorizontal: 5,
                    alignSelf:
                      horizontalAlignment == Alignment.RIGHT
                        ? 'flex-end'
                        : 'flex-start',
                  }}
                  direction={
                    verticalAlignment == Alignment.BOTTOM ? 'down' : 'up'
                  }
                />

                <View
                  style={{
                    backgroundColor: '#f5f5f5',
                    shadowColor: 'rgba(161,172,180,0.20)',
                    shadowRadius: 5,
                    shadowOpacity: 1,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: 10,
                    borderRadius: 8,
                  }}
                >
                  <View style={Styles.popupContainerStyle}>
                    <View style={Styles.wrappedTextStyle}>
                      <Text style={Styles.newFeatureText}>New Feature</Text>
                    </View>
                    <Text style={Styles.messageTextStyle}>
                      {this.props.message}
                    </Text>

                    <View style={Styles.wrappedTextStyle}>
                      <TouchableOpacity
                        style={{
                          zIndex: Number.MAX_VALUE,
                        }}
                        hitSlop={{ top: 10, bottom: 5, left: 5, right: 20 }}
                        onPress={onPress}
                      >
                        <Text style={Styles.okayTextStyle}>{actionTitle}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  }
}
