import { StyleSheet } from 'react-native';
import { R } from 'Resources';

export const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: R.Colors.COLOR_WHITE,
    paddingTop: 50,
    paddingBottom: 20,
    paddingLeft: 16
  },
  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    flex: 1
  },
  contentAlign: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 8
  },

  nameStyle: {
    color: R.Colors.COLOR_CARD_TEXT,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 19,
    paddingLeft: 14
  },
  subInfoTextStyle: {
    color: R.Colors.COLOR_CARD_INFO,
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    lineHeight: 14,
    paddingVertical: 4
  },
  subInfo: {
    marginLeft: 2,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 2
  },
  placeholder: {
    fontSize: 16,
    color: R.Colors.COLOR_FLOATING_LABEL,
    fontWeight: '500'
  },
  startDateLabel: {
    color: '#929CA5',
    opacity: 0.6,
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    letterSpacing: 0.16,
    lineHeight: 17
  },
  startDateText: {
    color: '#4A586B',
    opacity: 0.6,
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    letterSpacing: 0.16,
    lineHeight: 19,
    marginTop: 5
  }
});
