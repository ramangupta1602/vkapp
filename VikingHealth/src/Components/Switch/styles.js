import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  trackStyle: {
    backgroundColor: '#c8d2d8',
    width: 25,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    // backgroundColor: 'black',
    marginHorizontal: 6,
  },

  pointerStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D0444C',
  },

  textStyle: {
    color: '#D0444C',
    fontFamily: 'Lato-Regular',
    fontSize: 12,
    letterSpacing: 0.09,
    lineHeight: 15,
  },
});

/**
 * .grid {
  height: 15px;
  width: 24px;
  color: #D0444C;
  font-family: Lato;
  font-size: 12px;
  letter-spacing: 0.09px;
  line-height: 15px;
}
 */

export default styles;
