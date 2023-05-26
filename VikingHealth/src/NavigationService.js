import { NavigationActions } from 'react-navigation';
import AppUtil from './Library/Utils/AppUtil';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function pop() {
  _navigator.pop();
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function navigateAndClearHistory(routeName, params) {
  _navigator.dispatch(AppUtil.resetAction(routeName, params));
}

// add other navigation functions that you need and export them

export default {
  pop,
  navigate,
  setTopLevelNavigator,
  navigateAndClearHistory,
};
