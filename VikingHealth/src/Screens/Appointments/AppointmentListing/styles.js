import { StyleSheet } from 'react-native';
import { R } from '../../../Resources/R';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    // padding: 16,
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    paddingTop: 0,
    overflow: 'hidden',
  },

  titleStyle: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: 'Lato-Regular',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.22,
    lineHeight: 28,
    marginLeft: 8,
  },

  /**
   .appointments {
  height: 28px;
  width: 182px;
  color: #282727;
  font-family: Lato;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 0.22px;
  line-height: 28px;
}
   */
});

export default styles;
