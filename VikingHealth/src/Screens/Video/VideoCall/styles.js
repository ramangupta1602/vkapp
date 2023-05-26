import { StyleSheet } from 'react-native';
import { R } from 'Resources';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: R.Colors.COLOR_VIDEO_BACKGROUND
  },

  publisherContainer: {
    position: 'absolute',
    right: 10,
    top: 40,
    borderWidth: 1,
    borderRadius: 1,
    borderColor: 'transparent'
  },
  publisherStyle: {
    top: 50,
    width: 100,
    height: 130,
    padding: 2
  }
});
