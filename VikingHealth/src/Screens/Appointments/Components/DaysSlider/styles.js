import { StyleSheet, Platform } from 'react-native';
import { R } from '../../../../Resources/R';

const styles = StyleSheet.create({
  dayContainer: {
    height: 70,
    marginBottom: 7,
    marginHorizontal: 5,
    marginTop: 7,
    width: 77,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayTextStyle: {
    fontFamily: 'Lato-Regular',
    fontWeight: '600',
    letterSpacing: 0.12,
    lineHeight: 19,
    fontSize: 16,
    textTransform: 'uppercase',
  },

  dateTextStyle: {
    fontSize: 14,
    marginTop: 5,
    letterSpacing: 0.11,
    lineHeight: 17,
  },

  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(161,172,180,0.3)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0.75,
        shadowRadius: 7,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  dotIndicatorStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 5,
  },

  previouslySelectedDotStyle: {
    width: 5,
    height: 5,
    backgroundColor: 'gray',
    alignSelf: 'center',
    borderRadius: 2.5,
  },

  currentlySelectedDotStyle: {
    width: 5,
    height: 5,
    marginLeft: 2,
    backgroundColor: 'red',
    alignSelf: 'center',
    borderRadius: 2.5,
  },

  /**
.mon {
  height: 19px;
  width: 41px;
  color: #024481;
  font-family: Lato;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 19px;
  text-align: center;
}
     */
});

export default styles;
