import { StyleSheet } from 'react-native';
import { dynamicSize } from '../../../../utility/ResizeUtil';

const styles = StyleSheet.create({
  containerStyle: {
    padding: 16,
    height: '100%',
  },

  contentContainerStyle: {
    backgroundColor: 'white',
    // width: '100%',
    // height: '100%',
    flex: 1,
    marginTop: 10,
    borderRadius: 10,
    padding: 24,
    paddingTop: 18,
  },

  selectTimeRangeStyle: {
    color: '#024481',
    fontFamily: 'Lato-Regular',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0,
    lineHeight: 24,
  },

  timeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: dynamicSize(40),
  },

  time: {
    // flex: 1,
  },

  bedtimeText: {
    color: '#024481',
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 19,
    textAlign: 'center',
  },

  ampm: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
    marginTop: 6,
    color: '#024481',
  },

  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeValue: {
    color: '#024481',
    fontFamily: 'Lato-Regular',
    letterSpacing: 0,
    fontSize: 32,
    fontWeight: '300',
  },
  sleepTimeContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  clockHolderStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 40,
  },

  addButtonHolder: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    // position: 'absolute',
    marginTop: 0,
  },

  addButtonStyle: {
    width: 17,
    height: 17,
    tintColor: '#4361FF',
  },

  addText: {
    color: '#496CFF',
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 17,
    textAlign: 'right',
    marginLeft: 5,
  },

  /**
.add {
  height: 17px;
  width: 31px;
  color: #496CFF;
  font-family: Lato;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 17px;
  text-align: right;
}
   */
});

export default styles;
