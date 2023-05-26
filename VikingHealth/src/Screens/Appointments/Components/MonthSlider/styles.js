import { StyleSheet } from 'react-native';
import { R } from '../../../../Resources/R';

export const TAB_WIDTH = 100;
export const TAB_HEIGHT = 30;

const styles = StyleSheet.create({
  containerStyle: {
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textStyle: {
    color: '#898781',
    fontFamily: 'Lato-Semibold',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },

  selectedTabStyle: {
    color: '#024481',
    fontFamily: 'Lato-Semibold',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
  },

  dividerStyle: {
    width: 1,
    height: 16,
    alignSelf: 'center',
    backgroundColor: '#DCE2E7',
  },

  /**.sep-2020 {
.jul-2020 {
  height: 22px;
  width: 69px;
  color: #282727;
  font-family: Lato;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 22px;
  text-align: center;
}
   */
});

export default styles;
