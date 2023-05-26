import { StyleSheet, Platform } from 'react-native';
import { R } from 'Resources';
export const styles = StyleSheet.create({
  bottomView: {
    width: '100%',
    height: 280,
    backgroundColor: R.Colors.COLOR_WHITE,
    position: 'absolute',
    bottom: 0
    // justifyContent: 'space-around'
  },
  viewLine: {
    height: 1,
    width: '100%',
    backgroundColor: R.Colors.COLOR_BORDER
  },
  bottomViewTitle: {
    color: R.Colors.COLOR_TITLE,
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: 18
  },
  bottomValuesStyles: {
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  plusMinusButton: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  },
  highLightedTextStyle: {
    letterSpacing: 1.33,
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontFamily: 'Lato-Regular',
    fontSize: 40,
    marginRight: 5
    // lineHeight: 40
  },

  buttonStyle: {
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: R.Colors.COLOR_BUTTON
  },
  previousButton: {
    backgroundColor: R.Colors.COLOR_WHITE
  },
  nextButton: {
    backgroundColor: R.Colors.COLOR_BUTTON
  },

  buttonContainerStyle: {
    paddingHorizontal: 20,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonTextStyle: {
    color: R.Colors.COLOR_WHITE,
    fontSize: 14,
    fontWeight: 'bold'
  },
  buttonTextPreviousStyle: {
    color: R.Colors.COLOR_BUTTON,
    fontSize: 14,
    fontWeight: 'bold'
  },

  wheelContainerStyle: {
    marginTop: 18,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    height: 150,
    justifyContent: 'center'
    // backgroundColor: 'green'
  },

  textUnitStyle: {
    letterSpacing: 1.33,
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,

    ...Platform.select({
      ios: { marginTop: 10 },
      android: { marginTop: -10 }
    })
  },

  dotSeparatorStyle: {
    fontSize: 35,
    marginHorizontal: 5,
    ...Platform.select({
      ios: { marginVertical: 5 },
      android: { marginTop: -20 }
    })
  },

  wheelStyle: {
    overflow: 'hidden',
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        marginTop: -85,
        height: 190
      },
      android: {
        marginTop: -10,
        marginBottom: -20,
        height: 150
      }
    })
  }
});
