import React, { Component } from 'react';
import { View, Text, TextInput, SafeAreaView } from 'react-native';
import { Provider } from 'mobx-react';
import {Amplify, Auth } from 'aws-amplify';
import AWSAppSyncClient from 'aws-appsync';
import awsConfig from './aws-exports';
import { stores } from './src/Stores';
import { NetworkProvider } from 'react-native-offline';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider, withApollo } from 'react-apollo';
import PushNotification from 'react-native-push-notification';
import { AppContainer } from './src/navigation.js';
import NavigationService from './src/NavigationService';
import Instabug from 'instabug-reactnative';
import { 
    BottomTabBar, 
} from './src/Components/Tabbar/BottomTabBar';
import { 
    SplashImage, 
} from './src/Components/SplashImage';
import { 
    PushNotificationController 
} from './src/Components/LocalNotification/PushNotificationController';
import { BottomBarProvider } from './src/Context/BottomTabContext';
import { BottomBarConstant } from './src/Components/Tabbar/BottomTabBar';
import CodePush from 'react-native-code-push';

// import { Sentry } from 'react-native-sentry';

// Sentry.config(
//   'https://ac057d0b54804068ac55f11c9379aa5a@sentry.io/1514066'
// ).install();

Amplify.configure(awsConfig);

export const appsyncClient = new AWSAppSyncClient({
  url: awsConfig.API.aws_appsync_graphqlEndpoint,
  region: awsConfig.API.aws_appsync_region,
  auth: {
    type: 'AMAZON_COGNITO_USER_POOLS',
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken(),
  },
});
class AppNavigationContainer extends Component {
  onShowTabBar = () => {
    this.setState({ showTabBar: true });
  };

  onHideTabBar = () => {
    this.setState({ showTabBar: false });
  };

  onSetSelectedTab = (tab) => {
    this.setState({ selectedTab: tab });
  };

  setShowTabPopup = (popUpName) => {
    this.setState({ tabPopup: popUpName });
  };

  checkForReward = (shouldCheckForReward) => {
    this.setState({ shouldCheckForReward });
  };

  state = {
    hideBottomBar: this.onHideTabBar,
    showBottomBar: this.onShowTabBar,
    setSelectedTab: this.onSetSelectedTab,
    checkForReward: this.checkForReward,
    setTabPopup: this.setShowTabPopup,
    showTabBar: false,
    selectedTab: BottomBarConstant.ClearSelection,
    tabPopup: null,
    shouldCheckForReward: false,
  };

  render() {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;

    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;

    return (
      <View style={{ flex: 1 }}>
        <BottomBarProvider value={this.state} style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <PushNotificationController />
            <AppContainer
              ref={(navigatorRef) => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
          </View>
          <View
            style={{
              zIndex: Number.MAX_SAFE_INTEGER,
            }}
          >
            <BottomTabBar
              showTabBar={this.state.showTabBar}
              selectedTab={this.state.selectedTab}
              onSetSelectedTab={this.onSetSelectedTab}
              popUpName={this.state.tabPopup}
              shouldCheckForReward={this.state.shouldCheckForReward}
            />
          </View>
        </BottomBarProvider>
      </View>
    );
  }
}

export const AppWithClient = withApollo(AppNavigationContainer);

export default class App extends Component {
//   componentWillMount() {
//     Instabug.startWithToken('94e4f1acbb2de8e0bd314476296680bf', [
//       Instabug.invocationEvent.floatingButton,
//     ]);
//   }

constructor(props) {
  super(props);
  this.state = {codepushProgress: 0};
}


  componentDidMount() {
    PushNotification.popInitialNotification((notification) => {
      console.log(notification);
    });
    console.log('as');
    CodePush.sync({
      updateDialog: false,
      installMode: CodePush.InstallMode.IMMEDIATE,
      deploymentKey: Platform.select({
        android: 'etazICcvLk57LKInGq5bxFnxqkVz1iq2Bnyib',
      }),
    }, ()=>{}, (progress)=>{
      this.setState({
        codepushProgress: ((progress?.receivedBytes * 100) / progress.totalBytes)
      })
      console.log(progress, 'progress');
    });
  }

  getCodePushProgress = () => {
    if (this.state.codepushProgress === 0 || this.state.codepushProgress > 99) return null;
    return(
      <View
      style={{
        textAlign: 'center',
        paddingVertical: 10,
        backgroundColor: '#cfd7ff'
      }}
      ><Text>Codepush progress: {parseInt(this.state.codepushProgress)}%</Text></View>
    )
  }

  render() {
    return (
        <ApolloProvider client={appsyncClient}>
            <Rehydrated loading={<SplashImage />}>
            <Provider {...stores}>
                <AppWithClient {...this.props} />
                {this.getCodePushProgress()}
            </Provider>
            </Rehydrated>
        </ApolloProvider>
    );
  }
}

console.disableYellowBox = true;
