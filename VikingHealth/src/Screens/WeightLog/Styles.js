import { StyleSheet, Dimensions } from 'react-native';
import { R } from 'Resources';
export const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: 'flex-start',
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 44,
    paddingTop: 0,
    flex: 1
  },
  headerSubTitleStyle: {
    fontSize: 14,
    marginLeft: 10,
    color: R.Colors.COLOR_BLUE,
    fontFamily: 'Lato-Regular',
    fontWeight: '500'
  },
  loadingContainer: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }
});
