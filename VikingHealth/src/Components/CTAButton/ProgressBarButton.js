import React, { Component } from "react";
import {
	TouchableOpacity,
	Text,
	View,
	ActivityIndicator,
	Image,
} from "react-native";
import { ButtonState } from "./ButtonState";
import { R } from "Resources";

import { styles } from "./Styles";

export class ProgressBarButton extends Component {
	renderView(buttonState) {
		if (
			buttonState === ButtonState.Idle ||
			buttonState === ButtonState.Disabled
		) {
			return (
				<View>
					{this.props.children}
					<Text
						style={[
							styles.CTAText,
							{
								color: this.props.textColor || "white",
							},
							this.props.textStyle,
						]}
					>
						{this.props.label}
					</Text>
				</View>
			);
		} else if (buttonState === ButtonState.Progress) {
			return (
				<ActivityIndicator
					size="small"
					color={this.props.progressColor ? this.props.progressColor : "#fff"}
				/>
			);
		} else {
			return (
				<View>
					<View
						style={{
							flex: 1,
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Image
							style={{ width: 15, height: 15, marginRight: 10 }}
							source={R.Images.checkMark}
						/>
						<Text style={styles.CTATextSuccess}>{this.props.label}</Text>
					</View>
				</View>
			);
		}
	}

	getStateDependentStyle = () => {
		const { buttonState = ButtonState.Idle } = this.props;

		let style = null;

		switch (buttonState) {
			case ButtonState.Success:
				style = styles.CTASuccess;
				break;

			case ButtonState.Disabled:
				style = styles.CTAButtonDisabled;
				break;

			default:
				style = styles.CTAEnabled;
		}

		return style;
	};

	render() {
		const { buttonState = ButtonState.Idle } = this.props;
		const style = this.getStateDependentStyle();

		return (
			<TouchableOpacity
				testID={"progressButton"}
				accessibilityLabel={"progressButton"}
				style={[styles.CTAButton, style, this.props.style]}
				onPress={this.props.onClick}
				disabled={
					buttonState === ButtonState.Progress ||
					buttonState === ButtonState.Disabled
				}
			>
				{this.renderView(buttonState)}
			</TouchableOpacity>
		);
	}
}
