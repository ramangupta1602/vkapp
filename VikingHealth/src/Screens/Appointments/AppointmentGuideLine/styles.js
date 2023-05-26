import { StyleSheet, Platform } from 'react-native';
import { R } from '../../../Resources';

const Styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    // flex: 1,
    padding: 16,
    paddingTop: 60,
  },

  textStyle: {
    color: '#282727',
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 10,
  },

  titleStyle: {
    color: '#282727',
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 15,
  },

  /**
.1-you-will-not-be-a {
  height: 228px;
  width: 293px;
  color: #8191A2;
  font-family: Lato;
  font-size: 10px;
  letter-spacing: 0;
  line-height: 12px;
}
   */
});

export default Styles;
