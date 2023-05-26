import { StyleSheet } from 'react-native';
import { dynamicSize } from '../../../../utility/ResizeUtil';
import { R } from '../../../../Resources/R';

const styles = StyleSheet.create({
  containerStyle: {
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    flex: 1,
    overflow: 'hidden',
  },

  cancelledContainerStyle: {
    borderColor: '#EE2222',
    backgroundColor: '#FEEFEF',
  },

  normalContainerStyle: {
    borderColor: 'transparent',
    backgroundColor: 'white',
  },

  appointmentInfoContainer: {
    padding: dynamicSize(24.5),
  },

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  nameStyle: {
    color: R.Colors.PrimaryTextColor,
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0,
    lineHeight: 22,
    marginLeft: 12,
  },

  appointmentModeWrapperStyle: {
    overflow: 'hidden',
    flexWrap: 'wrap',
    flexShrink: 1,
    position: 'absolute',
    right: -4,
    top: -4,
    flexDirection: 'row',
    backgroundColor: '#D0444C',
    borderBottomLeftRadius: 10,
  },

  appointmentModeTextStyle: {
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 5,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 20,
    color: 'white',
  },

  wrappedText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },

  proposedTimeSlot: {
    backgroundColor: '#A1AAB3',
    borderRadius: 5,
    overflow: 'hidden',
    paddingHorizontal: 10,
    color: 'white',
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    letterSpacing: 0.18,
    lineHeight: 19,
    paddingVertical: 5,
    marginTop: 20,
  },

  slotsContainerStyle: {
    marginTop: -10,
  },

  slotContainerStyle: {
    flexDirection: 'row',
    marginTop: dynamicSize(24),
  },

  calendarIconStyle: {
    width: 13,
    height: 13,
    marginTop: 5,
  },

  timingContainerStyle: {
    marginLeft: 8,
  },

  dateTextStyle: {
    color: R.Colors.PrimaryTextColor,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0,
    lineHeight: 19,
  },

  timeTextStyle: {
    color: '#8695A6',
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 17,
  },

  viewLess: {
    color: R.Colors.COLOR_BLUE,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.12,
    lineHeight: 19,
    marginTop: dynamicSize(24),
  },

  slotCounterStyle: {
    height: 37,
    width: 43,
    marginTop: 10,
    borderRadius: 11,
    backgroundColor: R.Colors.COLOR_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slotCounterContainerStyle: {
    position: 'absolute',
    right: -30,
    bottom: 0,
    alignItems: 'center',
    width: 70,
  },

  videoCallIconStyle: {
    width: 70,
    height: 55,
    bottom: -10,
  },

  counterTextStyle: {
    color: 'white',
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0,
    lineHeight: 17,
  },

  buttonContainer: {
    minHeight: 53,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    right: -40,
    alignContent: 'center',
  },

  separatorStyle: {
    height: 1,
    backgroundColor: '#BFCCD4',
  },

  buttonTextStyle: {
    color: '#D0444C',
    fontFamily: 'Lato-Regular',
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 17,
  },

  cancellationMessageWrapperStyle: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    width: '100%',
    minHeight: 53,
    justifyContent: 'center',
    alignContent: 'center',
    marginRight: 40,
    paddingHorizontal: 24,
    paddingVertical: 4,
  },

  cancellationMessageTextStyle: {
    color: '#D0444C',
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 21,
  },

  /**
.this-appointment-has {
  height: 42px;
  width: 275px;
  color: #D0444C;
  font-family: Lato;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 21px;
}
   */
});

export default styles;
