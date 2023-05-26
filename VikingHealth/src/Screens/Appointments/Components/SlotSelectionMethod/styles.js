import { StyleSheet } from 'react-native';
import { dynamicSize } from '../../../../utility/ResizeUtil';

const styles = StyleSheet.create({
  containerStyle: {
    height: dynamicSize(63),
    width: '100%',
    backgroundColor: 'white',
  },

  touchableWrapperStyle: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  textStyle: {
    color: '#1072E0',
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0,
    lineHeight: 17,
    textAlign: 'center',
    flex: 1,
  },

  /**
   * .active {
  height: 17px;
  width: 71px;
  color: #1072E0;
  font-family: Lato;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 17px;
}
   */
});

export default styles;
