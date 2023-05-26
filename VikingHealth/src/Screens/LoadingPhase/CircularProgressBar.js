import React, { Component } from "react";
import { Easing } from "react-native";
import { Circle } from "react-native-svg";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { withNavigation } from "react-navigation";
import { R } from "../../Resources/R";

class CircularProgressBar extends Component {
  constructor(props) {
    super(props);
    this.circularProgress = null;

    this.state = { progress: this.props.progress };
  }

  componentDidMount() {
    this.willFocus = this.props.navigation.addListener("willFocus", () => {
      this.circularProgress.animate(0, 10, Easing.linear);
    });
    this.didFocus = this.props.navigation.addListener("didFocus", () => {
      this.circularProgress.animate(this.props.progress, 500, Easing.linear);
    });
  }

  render() {
    return (
      <AnimatedCircularProgress
        ref={(ref) => (this.circularProgress = ref)}
        size={43}
        width={3}
        fill={this.props.progress}
        tintColor={this.props.color}
        lineCap="square"
        padding={3}
        rotation={0}
        backgroundColor="#D9E4EA"
        renderCap={({ center }) => {
          return (
            <Circle cx={center.x} cy={center.y} r="4" fill={this.props.color} />
          );
        }}>
        {() => <R.SVGImage.CalorieStarIcon color={this.props.color} />}
      </AnimatedCircularProgress>
    );
  }
}

export default withNavigation(CircularProgressBar);

//  {/* <Image
//             source={R.Images.TempStar}
//             style={{ width: 9, height: 15 }}
//             tintColor='#43D35C'
//           /> */}
