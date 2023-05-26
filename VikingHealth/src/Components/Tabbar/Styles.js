import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  containerStyle: {
    width: '100%',
    shadowColor: 'rgba(161,172,180,0.50)',
    shadowOffset: { height: -6, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 15,
    backgroundColor: 'white',
  },

  holderStyle: {
    height: '100%',
    justifyContent: 'space-evenly',
    alignContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop:10
  },

  tabStyle: {
    flex: 1,
    // maxWidth: 60,
    marginBottom: 25,
    height: '100%',
    marginHorizontal: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  tabTextStyle: {
    color: 'rgba(129,145,162,1)',
    fontFamily: 'Lato-Bold',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0,
    lineHeight: 12,
    marginTop: 6,
  },

  tabImageStyle: {
    // width: 18,
    height: 18,
    backgroundColor: 'red',
  },

  tabWrapperStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    // flex: 1,
    flexGrow: 1,
  },

  lottieViewStyle: {
    height: 120,
    position: 'absolute',
    right: -15,
    bottom: 0,
  },

  /**
   * .dashboard {
  height: 12px;
  width: 50px;
  color: rgba(208,68,76,1);
  font-family: Lato;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 12px;
}
   */
});

export default style;
