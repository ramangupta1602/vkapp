import { StyleSheet, Platform } from 'react-native';
import { dynamicSize } from '../../../../utility/ResizeUtil';
import { R } from '../../../../Resources/R';

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    backgroundColor: 'white',

    marginBottom: -1,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(161,172,180,0.23)',
        shadowOffset: { height: -5, width: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 9,
      },
      android: {
        elevation: 100,
        marginTop: 5,
        height: 50,
      },
    }),
  },

  tabStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  tabContainer: {
    paddingTop: dynamicSize(28),
    paddingBottom: dynamicSize(32),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',

    ...Platform.select({
      android: {
        paddingTop: dynamicSize(20),
      },
    }),
  },

  tabTextStyle: {
    color: R.Colors.COLOR_BLUE,
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
    letterSpacing: 0,
    fontSize: 14,
  },

  bottomLineStyle: {
    height: 4,
    backgroundColor: '#1072E0',
    width: '50%',
  },

  /**
.rectangle-2-copy {
  height: 3px;
  width: 187px;
  background-color: #1072E0;
}
   */
});

export default styles;
