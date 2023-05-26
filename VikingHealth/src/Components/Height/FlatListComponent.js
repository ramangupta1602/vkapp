import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { R } from 'Resources';
const ITEM_HEIGHT = 30;
export class FlatListComponent extends Component {
  componentDidMount() {
    if (this.props.defaultValue) {
      this.scrollFlatListToIndex(this.props.defaultValue);
    }
  }

  scrollFlatListToIndex(value) {
    let offset = value * ITEM_HEIGHT;
    setTimeout(() => {
      this.flatListRef.scrollToOffset({ offset: offset, animated: false });
    }, 500);
  }

  onScrollEnd(event) {
    var yOffset = event.nativeEvent.contentOffset.y;
    let index = yOffset / ITEM_HEIGHT;

    if (typeof this.props.onValueUpdated === 'function') {
      this.props.onValueUpdated(Math.round(index));
    }
  }

  render() {
    return (
      <View>
        <FlatList
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index
          })}
          style={styles.flatList}
          //decelerationRate={30}
          ref={ref => {
            this.flatListRef = ref;
          }}
          //aecelerationRate={30}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment={'center'}
          data={this.props.data}
          onMomentumScrollEnd={this.onScrollEnd.bind(this)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Text style={styles.itemStyle}>{item}</Text>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View
          pointerEvents='none'
          style={[styles.overlay, styles.topOverlay]}
        />
        <View
          pointerEvents='none'
          style={[styles.overlay, styles.bottomOverlay]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    height: 90,
    width: 70
  },
  overlay: {
    height: ITEM_HEIGHT,
    width: 70,
    opacity: 0.5,
    backgroundColor: 'white',
    position: 'absolute'
  },
  topOverlay: {
    top: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  bottomOverlay: {
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: 'black'
  },
  itemStyle: {
    height: ITEM_HEIGHT,
    color: R.Colors.COLOR_TEXT,
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 32
  }
});
