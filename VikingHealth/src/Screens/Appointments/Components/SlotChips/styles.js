import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  containerStyle: {
    height: 42,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingLeft: 9,
    paddingRight: 12,
    // marginHorizontal: 11,
    marginVertical: 4,
  },

  crossIconStyle: {
    height: 8,
    width: 8,
    opacity: 0.75,
    marginLeft: 15,
  },

  dateStyle: {
    color: '#024481',
    fontFamily: 'Lato-Regular',
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 17,
    fontSize: 14,
  },

  timeStyle: {
    color: '#8191A2',
    fontFamily: 'Lato-Regular',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 12,
  },

  /**
.12-pm-01-pm {
  height: 12px;
  width: 84px;
  color: #8191A2;
  font-family: Lato;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 12px;
}
   */
});

export default styles;
