import { StyleSheet } from 'react-native';
import { R } from '../../../../Resources/R';

const styles = StyleSheet.create({
  containerStyle: {
    height: 40,
    width: '100%',
    //
  },

  tabContainerStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  horizontalBarStyle: {
    width: '33%',
    backgroundColor: '#1072E0',
    marginTop: 16,
    height: 3,
  },

  textStyle: {
    color: R.Colors.COLOR_BLUE,
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 17,
  },

  /*
  .completed-03 {
  height: 17px;
  width: 100.76px;
  color: #1072E0;
  font-family: Lato;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 17px;
  text-align: center;
}
  */
});

export default styles;
