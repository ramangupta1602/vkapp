import { StyleSheet } from 'react-native';
import { R } from 'Resources';
export const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: 'flex-start',
    flex: 1
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryHistoryContainer: {
    margin: 16
  }
});
