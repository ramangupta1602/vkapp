import { StyleSheet } from 'react-native';
import { R } from 'Resources';
export const styles = StyleSheet.create({
  textField: {
    height: 40,
    marginTop: 20,
    color: 'black',
    paddingTop: 20
  },
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND
  },
  view: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    paddingLeft: 24,
    paddingRight: 24
  },
  userName: {
    borderBottomWidth: 1,
    borderBottomColor: R.Colors.COLOR_FLOATING_LABEL,
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    padding: 4
  }
});
