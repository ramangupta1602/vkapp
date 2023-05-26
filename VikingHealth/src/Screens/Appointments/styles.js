import { StyleSheet } from 'react-native';
import { R } from '../../Resources/R';

export const ContainerHorizontalPadding = 16;

const styles = StyleSheet.create({
  containerStyle: {
    // backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    backgroundColor: 'white',
    flex: 1,
  },

  paddingHorizontal: {
    paddingHorizontal: ContainerHorizontalPadding,
  },

  backArrowPadding: {
    padding: 0,
    paddingTop: 40,
  },

  pageTitleStyle: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
    fontSize: 28,
    letterSpacing: 0.22,
    lineHeight: 34,
    marginTop: -12,
  },

  /**
 .you-can-only-book-an {
  height: 66px;
  width: 342px;
  color: #282727;
  font-family: Lato;
  font-size: 18px;
  letter-spacing: 0.14px;
  line-height: 22px;
}
   */
});

export default styles;
