import { StyleSheet } from 'react-native';
import { R } from '../../../Resources/R';
import { dynamicSize } from '../../../utility/ResizeUtil';

const styles = StyleSheet.create({
  currentIndicatorDotStyle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'red',
    alignSelf: 'center',
    // width: "100%",
  },

  messageTextStyle: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    letterSpacing: 0.14,
    lineHeight: 22,
    marginTop: 21,
  },

  monthListContainerStyle: {
    marginTop: dynamicSize(24),
  },

  daysListContainerStyle: {
    marginTop: dynamicSize(18),
  },

  slotsContainerStyle: {
    paddingTop: dynamicSize(22),
  },

  /**
   *  .you-can-only-book-an {
  height: 66px;
  width: 342px;
  color: #282727;
  font-family: Lato;
  font-size: 18px;
  letter-spacing: 0.14px;
  line-height: 22px;
}
   */
});

export default styles;
