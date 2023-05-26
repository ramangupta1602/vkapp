import { StyleSheet } from 'react-native';
import { R } from 'Resources';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  backgroundWhite: {
    backgroundColor: R.Colors.COLOR_WHITE
  },
  backgroundGrey: {
    backgroundColor: "rgb(203, 212, 220)"
  },
  containerCard: {
    shadowColor: R.Colors.COLOR_SHADOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    borderRadius: 10,
    marginVertical: 8,
    paddingVertical: 5,
    paddingHorizontal: 15
  },
  listContainer: {
    flex: 1,
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    paddingTop: 10
  },
  visiblityText: {
    color: '#1072E0',
    fontFamily: 'Lato',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 15
  },
  dateTime: {
    color: '#024481',
    fontFamily: 'Lato',
    fontSize: 14,
    lineHeight: 30,
    fontWeight: '700'
  },
  duration: {
    color: '#8191A2',
    fontFamily: 'Lato',
    fontSize: 14,
    lineHeight: 30
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
