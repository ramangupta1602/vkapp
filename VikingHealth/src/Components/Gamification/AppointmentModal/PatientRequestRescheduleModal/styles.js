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
    width: 232,
    height: 157,
  },

  titleStyle: {
    color: R.Colors.PrimaryTextColor,
    fontFamily: 'Lato-Regular',
    fontWeight: '600',
    letterSpacing: 0.77,
    lineHeight: 29,
    textAlign: 'center',
    fontSize: 24,
    marginTop: 19,
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
    marginTop: dynamicSize(16),
    // marginBottom: dynamicSize(16),
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});

export default styles;
