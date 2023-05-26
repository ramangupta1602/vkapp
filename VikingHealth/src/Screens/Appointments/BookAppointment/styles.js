import { StyleSheet } from 'react-native';
import { R } from '../../../Resources/R';
import { dynamicSize } from '../../../utility/ResizeUtil';

const styles = StyleSheet.create({
  currentIndicatorDotStyle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    // width: "100%",
  },

  nameTextStyle: {
    color: R.Colors.PrimaryTextColor,
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.16,
    lineHeight: 17,
    marginTop: 5,
  },

  messageTextStyle: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    letterSpacing: 0.14,
    lineHeight: 22,
    marginTop: 16,
  },

  monthListContainerStyle: {
    marginTop: dynamicSize(26),
  },

  daysListContainerStyle: {
    marginTop: dynamicSize(6),
  },

  slotsContainerStyle: {
    marginTop: dynamicSize(22),
  },

  chipScrollViewContainer: {
    maxHeight: 140,
    // minHeight: 100,
    backgroundColor: '#E1EBF2',
    paddingTop: 14,
  },

  chipContainerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E1EBF2',
    // paddingHorizontal: 5,
  },

  slotsWrapperStyle: {
    marginTop: 12,
    flexDirection: 'row',
  },

  reasonContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 28,
  },

  reasonBox: {
    backgroundColor: '#EFF5F9',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
  },

  tickCircleStyle: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  unavailableTextStyle: {
    color: R.Colors.PrimaryTextColor,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0,
    lineHeight: 19,
    paddingTop: 1,
  },

  writeYourReason: {
    color: '#3E4A59',
    fontFamily: 'Lato-Regular',
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16,
  },

  reasonInput: {
    borderBottomWidth: 2,
    paddingTop: 10,
    borderBottomColor: '#30DA51',
    color: '#24272B',
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 24,
  },

  /**
.my-family-celebratio {
  height: 72px;
  width: 308px;
  opacity: 0.8;
  color: #24272B;
  font-family: Lato;
  font-size: 18px;
  letter-spacing: 0;
  line-height: 24px;
}
   */
});

export default styles;
