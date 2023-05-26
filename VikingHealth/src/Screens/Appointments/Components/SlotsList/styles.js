import { StyleSheet } from 'react-native';
import { dynamicSize } from '../../../../utility/ResizeUtil';
import { R } from '../../../../Resources/R';

const styles = StyleSheet.create({
  slotContainerStyle: {
    marginTop: 10,
    height: 70,
    width: '100%',
    alignItems: 'center',
    paddingLeft: dynamicSize(10),
    paddingRight: dynamicSize(16),
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
  },

  selectedSlotConfettiImageStyle: {
    width: 64,
    height: '100%',
    marginBottom: 10,
    marginTop: 10,
    resizeMode: 'contain',
    // backgroundColor: 'red',
  },

  textStyle: {
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.12,
    lineHeight: 19,
    flex: 1,
    color: R.Colors.PrimaryTextColor,
    // textTransform: 'uppercase',
  },

  selectedTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 17,
  },

  unselectedTextStyle: {
    // color: '#655A5A',
    marginLeft: 9,
  },

  imageStyle: {
    width: 29,
    height: 28,
  },

  slotTimeStyle: {
    color: '#8695A6',
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 17,
  },

  passedTimeContainerStyle: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    top: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    opacity: 0.8,
  },

  passedTimeTextStyle: {
    color: '#CE363E',
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    letterSpacing: 0,
    lineHeight: 19,
  },

  /**
.you-cant-select-pas {
  height: 19px;
  width: 177px;
  color: #CE363E;
  font-family: Lato;
  font-size: 16px;
  letter-spacing: 0;
  line-height: 19px;
  text-align: center;
}
 */
});

export default styles;
