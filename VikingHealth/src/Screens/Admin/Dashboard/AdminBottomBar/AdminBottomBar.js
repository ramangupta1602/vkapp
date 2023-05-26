import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Styles from './styles';
import { withNavigation } from 'react-navigation';
import ScreenNameConstant from '../../../ScreenNameConstant';

const { width, height } = Dimensions.get('window');
const Tabbar = class AdminBottomBar extends Component {
  state = {
    selectedIndex: 0,
    animation: new Animated.Value(0),
  };

  bottomBarAnimatingStyle = () => {
    const { animation } = this.state;

    const translateInterpolation = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, width / 2],
    });

    return {
      transform: [{ translateX: translateInterpolation }],
    };
  };

  onTabChange = (index) => {
    const { animation } = this.state;

    this.setState({ selectedIndex: index }, () => {
      Animated.timing(animation, {
        toValue: index,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {});
    });

    this.handleScreenRedirection(index);
  };

  handleScreenRedirection = (selectedTab) => {
    switch (selectedTab) {
      case 0:
        this.props.navigation.navigate(ScreenNameConstant.CreateNewUser);
        break;

      case 1:
        this.props.navigation.navigate(ScreenNameConstant.AppointmentListing);
        break;

      default:
        break;
    }
  };

  hasChangedAppointmentCount = () => {
    const { previousCount, currentCount } = this.props;

    const {
      UPCOMING: P_Upcoming,
      PENDING: P_Pending,
      COMPLETED: P_Completed,
    } = previousCount;
    const {
      UPCOMING: C_Upcoming,
      PENDING: C_Pending,
      COMPLETED: C_Completed,
    } = currentCount;

    let sum = 0;

    if (C_Upcoming - P_Upcoming > 0) {
      sum += C_Upcoming - P_Upcoming;
    }

    if (C_Pending - P_Pending > 0) {
      sum += C_Pending - P_Pending;
    }

    if (C_Completed - P_Completed > 0) {
      sum += C_Completed - P_Completed;
    }

    return sum > 0 && P_Completed >= 0 && P_Pending >= 0 && P_Completed >= 0;
  };

  render() {
    const { previousCount, currentCount } = this.props;

    return (
      <View style={Styles.containerStyle}>
        <View style={{ flexDirection: 'row' }}>
          <Tab
            title={'Add patient'}
            isSelected={true}
            index={0}
            onClick={this.onTabChange}
          />

          <View
            style={{ height: '100%', width: 1, backgroundColor: '#BFCCD4' }}
          />

          <Tab
            title={'Appointments'}
            isSelected={true}
            index={1}
            onClick={this.onTabChange}
            shouldShowBadge={this.hasChangedAppointmentCount()}
          />
        </View>
      </View>
    );
  }
};

function Tab({ title, badge, isSelected, index, onClick, shouldShowBadge }) {
  const textColor = isSelected ? '#1072E0' : '#A1AAB3';

  return (
    <View style={Styles.tabStyle}>
      <TouchableOpacity
        // activeOpacity={0.75}
        onPress={() => {
          if (onClick) {
            onClick(index);
          }
        }}
        style={Styles.tabContainer}
        hitSlop={{ top: 10, right: 20, left: 20, bottom: 10 }}
      >
        <Text style={[Styles.tabTextStyle, { color: textColor }]}>{title}</Text>
        {shouldShowBadge && (
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              marginLeft: 6,
              backgroundColor: 'red',
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

export default withNavigation(Tabbar);
