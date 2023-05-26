import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    padding: 30
  },
  textfieldContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 40,
    marginRight: 40,
    marginTop: 30
  },
  textInput: {
    height: 80,
    width: 200,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 50
  }
});
