import { StyleSheet } from 'react-native';
import { R } from 'Resources';
export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%'
  },
  textStyle: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 17,
    color: R.Colors.COLOR_TEXT,
    textAlign: 'center'
  },

  containerAllWeek: {
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  imageArrow: {
    resizeMode: 'contain',
    width: 10,
    padding: 5,
    height: 14
  }
});
