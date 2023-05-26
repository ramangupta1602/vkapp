import { StyleSheet } from 'react-native';
import { R } from '../../../../Resources/R';
import { dynamicSize } from '../../../../utility/ResizeUtil';

const commonTextStyle = {
  fontFamily: 'Lato-Regular',
  color: R.Colors.PrimaryTextColor,
  letterSpacing: 0.7,
  fontSize: 16,
};

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF5F9',
    paddingTop: 28,
    paddingHorizontal: 22,
    paddingBottom: 34,
  },

  imageStyle: {
    width: 175,
    height: 165,
  },

  textStyle: {
    ...commonTextStyle,
    textAlign: 'center',
    marginTop: 20,
    letterSpacing: 0.48,
    lineHeight: 21,
  },

  confirmButtonStyle: {
    flex: 1,
    marginTop: dynamicSize(34),
  },

  denyButtonStyle: {
    flex: 1,
    marginTop: dynamicSize(0),
    // marginBottom: dynamicSize(16),
    backgroundColor: 'transparent',
    borderWidth: 0,
  },

  messageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
.are-you-sure-you-are {
  height: 155px;
  width: 267px;
  color: #024481;
  font-family: Lato;
  font-size: 16px;
  letter-spacing: 0.48px;
  line-height: 21px;
  text-align: center;
}
   */
});

export default styles;
