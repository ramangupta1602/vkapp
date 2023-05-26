import React, { Component } from "react";
import { View, Text, Animated } from "react-native";
import Styles from "./styles";
import LottieView from "lottie-react-native";

export default class WalkThroughComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelected: this.props.isSelected,
      isAutoPlaying: true,
      progress: new Animated.Value(0),
      finalProgress: this.props.finalProgress,
      offset: 0,
    };

    this.startAnimation();
  }

  componentDidUpdate(oldProps) {
    // if nothing change then simply return
    if (
      oldProps.isSelected === this.props.isSelected &&
      oldProps.offset === this.props.offset
    ) {
      return;
    }

    // if only page is slided and not changed, then also
    // adjust animation offset according to it
    if (
      oldProps.isSelected === this.props.isSelected &&
      oldProps.offset !== this.props.offset
    ) {
      this.setState({
        finalProgress: this.props.finalProgress,
        offset: this.props.offset,
      });
      return;
    }

    // if this is not current page, then reset animation to the starting
    // so then when sliding back it don't show any animation
    if (!this.props.isSelected) {
      this.state.progress.setValue(0);
      this.setState({ offset: 0, finalProgress: 0 });
      return;
    }

    // after all that, now we have our page selected, now we have to restart our animation
    this.state.progress.setValue(0);
    this.startAnimation();
    // this.props.scrollEnabled(false);
    this.setState({
      isSelected: this.props.isSelected,
      isAutoPlaying: true,
      finalProgress: this.props.finalProgress,
      offset: this.props.offset,
    });
  }

  startAnimation = () => {
    const { finalProgress } = this.props;
    this.state.progress.setValue(0);
    this.props.scrollEnabled(false);

    Animated.timing(this.state.progress, {
      toValue: finalProgress,
      duration: 3000,
    }).start(() => {
      this.props.scrollEnabled(true);
      this.setState({ isAutoPlaying: false });
      this.props.scrollEnabled(true);
    });
  };

  render() {
    let offset = this.state.offset / 4 + this.state.finalProgress;

    if (offset > 1 || offset < 0) {
      offset = 0;
    }

    if (!this.state.isSelected) {
      offset = 0;
    }

    return (
      <View style={{ flex: 1 }}>
        <View
          style={[Styles.walkThroughImageStyle, { ...this.props.imageStyle }]}>
          <LottieView
            ref={(animation) => {
              this.animation = animation;
            }}
            source={this.props.animation}
            progress={this.state.isAutoPlaying ? this.state.progress : offset}
          />
        </View>

        <Text style={Styles.walkThroughHeadingTextStyle}>
          {this.props.title}
        </Text>

        <Text style={[Styles.walkThroughSubTextStyle]}>
          {this.props.text} {this.props.children}{" "}
        </Text>
      </View>
    );
  }

  getProgress = () => {
    return this.state.progress;

    // if (this.state.isAutoPlaying) {
    //   return this.state.progress;
    // }
    // if (this.state.isSelected && this.props.offset) {
    //   return this.props.finalProgress + this.props.offset;
    // }
  };
}
