import React, { Component } from "react";
import { Text, View, Animated, Easing } from "react-native";

export default class TextAnimation extends Component {
	state = {
		value: 0.0,
		animation: new Animated.Value(0),
	};

	constructor(props) {
		super(props);

		this.numberArray = this.getNumberArray(this.props.number);
	}

	getNumberArray = (number = 0) => {
		const stringNumber = `${number}`;
		return Array.from(stringNumber);
	};

	startAnimation = () => {
		Animated.timing(this.state.animation, {
			toValue: 1,
			duration: 1500,
			easing: Easing.linear,
		}).start();
	};

	componentDidMount() {
		if (this.props.animate) {
			setTimeout(() => {
				this.startAnimation();
			}, 500);
		}
	}

	render() {
		return (
			<View style={{ flexDirection: "row" }}>
				{this.numberArray.map((value, index) => {
					return (
						<Tick
							key={index}
							style={this.props.style || {}}
							value={value}
							height={30}
							animation={this.state.animation}
							animate={this.props.animate}
						/>
					);
				})}
			</View>
		);
	}
}

class Tick extends Component {
	constructor(props) {
		super(props);

		this.numberArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	}

	getTranslation = () => {
		const { height } = this.props;
		const value = parseInt(this.props.value);

		if (!this.props.animate) {
			return {
				transform: [{ translateY: -height * value }],
			};
		}

		const interpolation = this.props.animation.interpolate({
			inputRange: [0, 1],
			outputRange: [height, -height * value],
		});

		return {
			transform: [{ translateY: interpolation }],
		};
	};

	render() {
		const translationStyle = this.getTranslation();
		const { height } = this.props;

		return (
			<View style={{ height, overflow: "hidden" }}>
				<Animated.View style={translationStyle}>
					{this.numberArray.map((number) => {
						return <Text style={this.props.style}>{number}</Text>;
					})}
				</Animated.View>
			</View>
		);
	}
}
