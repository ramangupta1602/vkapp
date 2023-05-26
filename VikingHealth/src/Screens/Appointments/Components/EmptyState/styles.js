import { StyleSheet } from 'react-native';
import { R } from '../../../../Resources/R';
import { dynamicSize } from '../../../../utility/ResizeUtil';

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageStyle: {
    width: 179,
    height: 165,
  },

  textStyle: {
    color: R.Colors.PrimaryTextColor,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    letterSpacing: 0.48,
    lineHeight: 21,
    padding: dynamicSize(50),
    textAlign: 'center',
  },

  /**
 .there-are-no-appoint {
  height: 46px;
  width: 217px;
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
