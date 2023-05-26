import React, { Component } from 'react';

import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { R } from 'Resources';
export class GenderPicker extends Component {
  constructor(props) {
    super(props);
    if (this.props.gender) {
      this.state = { gender: this.props.gender };
    } else {
      this.state = { gender: '' };
    }
  }

  componentDidUpdate(oldProps) {
    if (oldProps != this.props) {
      if (this.props.gender) {
        this.setState({ gender: this.props.gender });
      }
    }
  }

  genderSelected(gender) {
    this.setState({ gender });
    this.props.onSelect(gender);
  }

  render() {
    return (
      <View style={genderPickerStyle.container}>
        <GenderButton
          title='Male'
          genderSelected={() => this.genderSelected('male')}
          isSelected={this.state.gender === 'male'}
          isLast={false}
        />

        <GenderButton
          title='Female'
          genderSelected={() => this.genderSelected('female')}
          isSelected={this.state.gender === 'female'}
          isLast={false}
        />

        <GenderButton
          title='Other'
          genderSelected={() => this.genderSelected('other')}
          isSelected={this.state.gender === 'other'}
          isLast
        />
      </View>
    );
  }
}

const genderPickerStyle = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15
  },
  genderButtonBox: {
    flex: 1
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center'
  }
});

class GenderButton extends Component {
  buttonPress() {
    this.props.genderSelected();
  }

  render() {
    const buttonStyle = {
      flex: 1,
      height: 50,
      borderRadius: 5,
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: this.props.isSelected
        ? '#5FA1D5'
        : R.Colors.COLOR_APP_BACKGROUND,
      borderColor: this.props.isSelected ? '#5FA1D5' : '#929CA5',
      borderWidth: 1,
      marginRight: this.props.isLast ? 0 : 10
    };

    const buttonTitleStyle = {
      color: this.props.isSelected ? R.Colors.COLOR_APP_BACKGROUND : '#929CA5',
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center'
    };

    return (
      <TouchableOpacity
        onPress={this.buttonPress.bind(this)}
        style={genderPickerStyle.genderButtonBox}
      >
        <View style={buttonStyle}>
          <Text style={buttonTitleStyle}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
