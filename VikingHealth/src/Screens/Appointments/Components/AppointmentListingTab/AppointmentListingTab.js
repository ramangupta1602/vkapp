import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Styles from './styles';
import * as AppointmentQueries from '../../../../AppSyncQueries/AppointmentQueries';
import { Query } from 'react-apollo';

export const TabsName = {
  Upcoming: 0,
  Pending: 1,
  Completed: 2,
};

const { width } = Dimensions.get('screen');

export class AppointmentListingTab extends Component {
  constructor(props) {
    super(props);

    const selectedIndex = props.selectedTab;

    this.state = {
      animation: new Animated.Value(selectedIndex),
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedTab != prevProps) {
      const selectedIndex = this.props.selectedTab;
      this.animateToValue(selectedIndex);
    }
  }

  animateToValue = (value) => {
    const { animation } = this.state;

    Animated.timing(animation, {
      toValue: value,
      duration: 400,
    }).start();
  };

  getTranslationStyle = () => {
    const { animation } = this.state;

    const slidingInterpolation = animation.interpolate({
      inputRange: [0, 2],
      outputRange: [0, width * 0.67],
    });

    return {
      transform: [{ translateX: slidingInterpolation }],
    };
  };

  render() {
    const {
      onTabChange,
      selectedTab = TabsName.Upcoming,
      style,
      currentCount,
      previousCount,
    } = this.props;
    const slidingStyle = this.getTranslationStyle();

    return (
      <View style={[Styles.containerStyle, style]}>
        <View style={Styles.tabContainerStyle}>
          <Tabs
            title={'Upcoming'}
            onClick={onTabChange}
            isSelected={selectedTab === TabsName.Upcoming}
            highlight={
              previousCount.UPCOMING < currentCount.UPCOMING &&
              previousCount.UPCOMING >= 0
            }
            index={TabsName.Upcoming}
            count={currentCount.UPCOMING}
            justifyContent='flex-start'
          />
          <Tabs
            title={'Pending'}
            onClick={onTabChange}
            isSelected={selectedTab === TabsName.Pending}
            count={currentCount.PENDING}
            highlight={
              previousCount.PENDING < currentCount.PENDING &&
              previousCount.PENDING >= 0
            }
            index={TabsName.Pending}
          />
          <Tabs
            title={'Completed'}
            onClick={onTabChange}
            isSelected={selectedTab === TabsName.Completed}
            highlight={
              previousCount.COMPLETED < currentCount.COMPLETED &&
              previousCount.COMPLETED >= 0
            }
            count={currentCount.COMPLETED}
            index={TabsName.Completed}
            justifyContent='flex-end'
          />
        </View>

        <Animated.View style={[Styles.horizontalBarStyle, slidingStyle]} />
      </View>
    );
  }
}

function Tabs({
  title,
  count,
  isSelected,
  onClick,
  index,
  highlight,
  justifyContent = 'center',
}) {
  const textColor = isSelected ? '#1072E0' : '#A1AAB3';

  return (
    <TouchableOpacity
      hitSlop={{ top: 10, left: 20, right: 20, bottom: 10 }}
      onPress={() => {
        if (onClick) {
          onClick(index);
        }
      }}
      style={{
        flexDirection: 'row',
        justifyContent,
        // alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
      }}
    >
      <Text style={[Styles.textStyle, { color: textColor }]}>
        {title} {count >= 0 ? `(${count})` : ''}
      </Text>

      {highlight && (
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
  );
}
