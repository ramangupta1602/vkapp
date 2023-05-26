import { StyleSheet } from 'react-native';
import { R } from 'Resources';
export const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: 'flex-start',
    flex: 1,
    marginTop: 40
  },
  secondContainer: {
    marginLeft: 16,
    marginRight: 16,
    flex: 1
  },

  headerContainer: {
    height: 50,
    marginTop: 40,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textFieldWeightLoss: {
    fontSize: 14,
    marginLeft: 15,
    color: R.Colors.COLOR_TEXT_LIGHT,
    fontFamily: 'Lato-Regular'
  },
  rebootText: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Lato-Regular',
    color: R.Colors.COLOR_TEXT
  },
  rebootDescription: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    lineHeight: 18,
    color: R.Colors.COLOR_TEXT
  },
  title: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    fontWeight: '600',
    color: R.Colors.COLOR_TEXT
  },
  startLater: {
    fontSize: 14,
    marginTop: 18,
    fontFamily: 'Lato-Regular',
    fontWeight: '600',
    alignSelf: 'center',
    color: R.Colors.COLOR_BLUE
  },
  imageBack: {
    width: 25,
    height: 20,
    resizeMode: 'contain'
  },
  backButtonStyle: {
    padding: 10
  },
  viewDetails: {
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    lineHeight: 17
  }
});
