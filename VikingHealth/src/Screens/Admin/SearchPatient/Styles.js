import { StyleSheet } from 'react-native';
import { R } from 'Resources';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_WHITE,
    paddingTop: 22,
    borderBottomColor: 'rgb(218, 219, 221)',
    borderBottomWidth: 2,
    flex: 1
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: R.Colors.COLOR_WHITE
  },
  detailsContainer: {
    position: 'relative',
    alignSelf: 'center',
    width: '90%',
    top: '85%'
  },
  wrapper: {
    flex: 1
  },
  searchInput: {
    height: 40,
    width: '85%',
    marginLeft: 20
  },
  wrapperPatient: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    flex: 1,
    paddingTop: 20
  },
  toastText: {
    color: '#FFFFFF',
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    fontWeight: 'bold'
  },
  backButtonStyle: {
    width: 20,
    height: 16,
    resizeMode: 'contain'
  },
  progressBarStyle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});
