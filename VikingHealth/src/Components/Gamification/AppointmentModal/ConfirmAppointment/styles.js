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
    width: 205,
    height: 139,
  },

  titleStyle: {
    ...commonTextStyle,
    fontSize: 22,
    lineHeight: 27,
    marginTop: 20,
  },

  textStyle: {
    ...commonTextStyle,
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 0,
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

  /**
   * .confirm-appointment {
  height: 27px;
  width: 283px;
  color: #024481;
  font-family: Lato;
  font-size: 22px;
  letter-spacing: 0.7px;
  line-height: 27px;
  text-align: center;
}
   */
});

export default styles;
