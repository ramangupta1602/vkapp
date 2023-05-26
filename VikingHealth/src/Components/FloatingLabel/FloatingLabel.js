import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { R } from 'Resources';

export class FloatingLabelInput extends Component {
  constructor(props) {
    super(props);
    this.rnTextInput = React.createRef();
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

  state = {
    isFocused: false,
    isPassword: this.props.secureTextEntry
  };

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      this.props.value === '' ? 0 : 1
    );
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== '' ? 1 : 0,
      duration: 200
    }).start();
  }

  onChangeText = text => {
    if (typeof this.props.onChangeText === 'function') {
      this.props.onChangeText(text);
    }
  };

  getErrorElement() {
    if (this.props.isError) {
      return (
        <Text style={floatingLabelInputStyles.errorLabel}>
          {this.props.errorDescription}
        </Text>
      );
    }
    return;
  }

  becomeFirstResponder() {
    this.rnTextInput.current.focus();
  }

  resignFirstResponder() {
    this.rnTextInput.current.blur();
  }

  handleBlur = () => {
    this.setState({ isFocused: false });
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur();
    }
  };

  handleFocus = () => {
    this.setState({ isFocused: true, isError: false });
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus();
    }
  };
  toggleSwitch() {
    this.setState({ isPassword: !this.state.isPassword });
  }
  render() {
    const { label, ...props } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [25, 0]
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 14]
      }),
      color: R.Colors.COLOR_FLOATING_LABEL
    };

    const textInputStyle = {
      marginBottom: this.props.isError ? 2 : 19
    };

    const newProps = { ...props, secureTextEntry: this.state.isPassword };
    const icon = newProps.secureTextEntry ? R.Images.show : R.Images.hide;
    return (
      <View style={{ paddingTop: 18, marginBottom: 10 }}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        {this.props.secureTextEntry ? (
          <View>
            <TextInput
              {...newProps}
              style={[floatingLabelInputStyles.textInput, textInputStyle]}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              onChangeText={this.onChangeText}
              blurOnSubmits
              ref={this.rnTextInput}
            />
            <TouchableOpacity
              onPress={this.toggleSwitch}
              style={floatingLabelInputStyles.showPassword}
            >
              <Image source={icon} style={floatingLabelInputStyles.image} />
            </TouchableOpacity>
          </View>
        ) : (
          <TextInput
            {...props}
            style={[floatingLabelInputStyles.textInput, textInputStyle]}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChangeText={this.onChangeText}
            blurOnSubmits
            ref={this.rnTextInput}
          />
        )}
        {this.getErrorElement()}
      </View>
    );
  }
}

const floatingLabelInputStyles = StyleSheet.create({
  textInput: {
    height: 43,
    fontSize: 18,
    color: R.Colors.COLOR_FLOATING_TEXT,
    borderBottomWidth: 0.5,
    borderBottomColor: R.Colors.COLOR_FLOATING_LABEL
  },
  errorLabel: {
    // marginTop: 5,
    fontSize: 14,
    color: R.Colors.COLOR_ERROR
    // marginBottom: 10,
  },
  showPassword: {
    position: 'absolute',
    right: 0,
    top: 10
  },
  image: {
    height: 20,
    width: 20,
    padding: 5,
    resizeMode: 'contain'
  }
});
