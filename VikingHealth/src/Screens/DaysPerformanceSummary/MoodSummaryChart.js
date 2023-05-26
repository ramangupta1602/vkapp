import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { MOODS } from '../DaysPerformance/Moods';
import { Legend } from './Legend';

export class MoodSummaryChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      maxIndex: 2,
      maxPercentage: 0
    };
    this.calculateState(props.data, true);
  }

  calculateState(data, firstTimeRender) {
    let maxIndex = data.reduce(
      (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
      0
    );
    maxIndex = Math.abs(maxIndex - 4) + 1;
    let total = data.reduce((a, b) => a + b, 0);
    let maxValue = Math.max.apply(null, data);
    let maxPercentage = Math.round((maxValue / total) * 100);

    if (firstTimeRender) {
      this.state = {
        data: data,
        maxIndex: maxIndex,
        maxPercentage: maxPercentage
      };
    } else {
      this.setState({
        data: data,
        maxIndex: maxIndex,
        maxPercentage: maxPercentage
      });
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props != oldProps) {
      this.calculateState(this.props.data, false);
    }
  }

  renderMessage(mood, value) {
    let startingMessage = MOODS[mood.toString()].encouragementMessage;
    let color = MOODS[mood.toString()].color;
    let moodName = MOODS[mood.toString()].name;

    return (
      <Text style={styles.messageText}>
        {startingMessage} You did{' '}
        <Text style={{ color: color, fontWeight: '800' }}>
          {moodName.toLowerCase()}
        </Text>{' '}
        {value}% of times.
      </Text>
    );
  }

  render() {
    const colors = [
      MOODS['5'].color,
      MOODS['4'].color,
      MOODS['3'].color,
      MOODS['2'].color,
      MOODS['1'].color
    ];

    const pieData = this.state.data.map((value, index) => ({
      value: value <= -1 ? 0 : value,
      svg: {
        fill: colors[index]
      },
      key: `pie-${index}`
    }));

    let moodIcon = MOODS[this.state.maxIndex.toString()].icon;
    return (
      <View style={styles.container}>
        <View style={styles.pieChartContainer}>
          <PieChart
            style={styles.pieChart}
            data={pieData}
            padAngle={0}
            outerRadius={'100%'}
            innerRadius={'85%'}
          />
          <View style={styles.pieChartInnerContainer}>
            <Image source={moodIcon} style={styles.moodImage} />
            <Text style={styles.moodPercentageText}>
              {this.state.maxPercentage}%
            </Text>
          </View>
        </View>
        {this.renderMessage(this.state.maxIndex, this.state.maxPercentage)}
        <View style={styles.legendContainer}>
          <Legend />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    marginTop: 30,
    marginHorizontal: 24
    // backgroundColor: 'red'
  },

  pieChartContainer: {
    width: 120,
    height: 120,
    // backgroundColor: 'yellow',
    margin: 15
  },

  legendContainer: {
    // backgroundColor: 'green',
    marginTop: 20,
    height: 40,
    width: '100%'
  },

  pieChartInnerContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    // flex: 1,
    width: '85%',
    height: '85%',
    margin: '7.5%',
    borderRadius: 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  pieChart: {
    // position: 'absolute',
    height: 120,
    width: 120
  },

  moodImage: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    margin: 10
  },

  moodPercentageText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Lato-Regular',
    letterSpacing: 0.5,
    lineHeight: 17,
    color: '#3f3f3f'
  },

  messageText: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.5,
    fontFamily: 'Lato-Regular'
  }
});
