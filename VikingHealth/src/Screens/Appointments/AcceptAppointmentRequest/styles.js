import { StyleSheet } from 'react-native';
import { R } from '../../../Resources/R';
import { dynamicSize } from '../../../utility/ResizeUtil';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    // padding: 20,
  },

  scrollViewContainerStyle: {
    flex: 1,
  },

  buttonContainer: {
    width: '100%',
    padding: 16,
    paddingTop: 16,
  },

  messageTextStyle: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    letterSpacing: 0.14,
    lineHeight: 22,
    marginTop: 13,
    fontWeight: 'bold',
  },

  warningBox: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 16,
    marginTop: dynamicSize(24),
    paddingLeft: dynamicSize(20),
    flexDirection: 'row',
  },

  warningLogoStyle: {
    width: dynamicSize(40),
    height: dynamicSize(40),
  },

  messageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },

  warningMessageStyle: {
    marginLeft: dynamicSize(15),
    color: R.Colors.COLOR_TEXT,
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    letterSpacing: 0.14,
    lineHeight: 22,
  },

  purposedTimeSlotTextStyle: {
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: R.Colors.COLOR_TEXT_GREY,
    marginTop: dynamicSize(30),
    paddingTop: 2,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 12,
    color: 'white',
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    lineHeight: 19,
  },

  rescheduleReasonContainerStyle: {
    marginTop: 13,
    backgroundColor: '#EFF5F9',
    borderRadius: 10,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 17,
  },

  rescheduleImageStyle: {
    width: 20,
    height: 20,
  },

  rescheduleTitleTextStyle: {
    color: '#024481',
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 19,
  },

  rescheduleReasonTextStyle: {
    color: '#24272B',
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#30DA51',
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    // marginLeft: 10,
  },

  appointmentModeTitle: {
    color: '#282727',
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.12,
    lineHeight: 19,
  },
});

/**
 * 
 * .your-reward-history {
  height: 19px;
  width: 149px;
  color: #282727;
  font-family: Lato;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.12px;
  line-height: 19px;
}
 */

export default styles;
