import React from 'react';
import {
  FlatList,
  Platform,
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import * as DateUtils from '../../../../Library/Utils/DateUtil';
import { R } from '../../../../Resources/R';

import Styles, { TAB_WIDTH, TAB_HEIGHT } from './styles';
import { ContainerHorizontalPadding } from '../../styles';

const { width } = Dimensions.get('window');
const screenWidth = width - 2 * ContainerHorizontalPadding;
const ListViewHeaderWidth = screenWidth / 2 - TAB_WIDTH / 2;

export class MonthSlider extends React.Component {
  constructor(props) {
    super(props);
    this.viewabilityConfig = {
      itemVisiblePercentThreshold: 50,
    };

    this.state = {
      selectedMonthIndex: 0,
      animated: new Animated.Value(0),
    };
  }

  getMonthNameAnimatedStyle = (index) => {
    const { animated } = this.state;

    const backgroundColorInterpolation = animated.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: ['#A1AAB3', '#024481', '#A1AAB3'],
      extrapolate: 'clamp',
    });

    return {
      fontSize: 14,
      fontWeight: 'bold',

      color: backgroundColorInterpolation,
    };
  };

  renderMonth = ({ item, index }) => {
    const { selectedMonthIndex } = this.state;
    const animatingStyle = this.getMonthNameAnimatedStyle(index);

    return (
      <TouchableOpacity
        style={Styles.containerStyle}
        onPress={() => {
          this.onMonthClicked(item, index);
        }}
      >
        <Animated.Text
          style={[
            index === selectedMonthIndex
              ? Styles.selectedTabStyle
              : Styles.textStyle,
            animatingStyle,
          ]}
        >
          {item}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  renderHeaderComponent = () => {
    return <View style={{ width: ListViewHeaderWidth }} />;
  };

  onMonthClicked = (item, index) => {
    if (this.scrollRef) {
      this.scrollRef.scrollToOffset({
        offset: index * TAB_WIDTH,
        animated: true,
      });
    }

    if (Platform.OS === 'ios') {
      return;
    }

    // On Android, their is an issue on flatlist that it doesnot call onMomuntumEnd
    // on used with scrollToOffset, of overcome this, I am directly calling listener
    const { months } = this.props;
    if (this.props.onMonthChange) {
      this.props.onMonthChange(months[index], index);
    }
  };

  onScrollEnd = ({
    nativeEvent: {
      contentOffset: { x },
    },
  }) => {
    this.calculateValueFromOffset(x);
  };

  calculateValueFromOffset = (offset) => {
    const index = Math.floor(offset / TAB_WIDTH);
    const { months } = this.props;

    console.log('offset', offset, months, months[index]);

    if (this.props.onMonthChange) {
      this.props.onMonthChange(months[index], index);
    }

    this.setState({ selectedMonthIndex: index });
  };

  render() {
    const { months } = this.props;
    const { selectedMonthIndex } = this.state;
    const { style } = this.props;

    return (
      <View style={style}>
        <FlatList
          ref={(ref) => {
            this.scrollRef = ref;
          }}
          showsHorizontalScrollIndicator={false}
          data={months}
          horizontal
          keyExtractor={(_, index) => {
            return `${index} ${selectedMonthIndex === index}`;
          }}
          viewabilityConfig={this.viewabilityConfig}
          renderItem={this.renderMonth}
          ListHeaderComponent={this.renderHeaderComponent}
          ListFooterComponent={this.renderHeaderComponent}
          ItemSeparatorComponent={() => {
            return <View style={Styles.dividerStyle} />;
          }}
          snapToInterval={TAB_WIDTH}
          onMomentumScrollEnd={this.onScrollEnd}
          extraData={this.state}
          onScroll={({
            nativeEvent: {
              contentOffset: { x },
            },
          }) => {
            this.state.animated.setValue(x / TAB_WIDTH);
          }}
        />
      </View>
    );
  }
}
