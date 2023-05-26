import { StyleSheet } from 'react-native';
import { R } from 'Resources';
export const styles = StyleSheet.create({
  appLogo: {
    height: 100,
    width: 160,
    marginTop: 20,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  container: {
    flex: 1,
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: 'flex-start',
    paddingTop: 70
  },
  textField: {
    height: 40,
    marginTop: 20,
    color: 'black',
    paddingTop: 20
  },
  loginContainer: {
    flex: 1,
    marginTop: 50,
    padding: 30
  },
  forgotPasswordBtnContainer: {
    alignSelf: 'flex-end',
    width: 130,
    // paddingRight: 20,
    marginTop: 0
  },
  forgotPasswordBtn: {
    fontSize: 14,
    color: R.Colors.COLOR_FORGOT_PASSWORD_TEXT,
    fontWeight: 'bold'
  },
  userName: {
    borderBottomWidth: 1,
    borderBottomColor: R.Colors.COLOR_FLOATING_LABEL,
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    padding: 2
  }
});
