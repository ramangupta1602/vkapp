import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import Styles from './styles';
import { R } from '../../../Resources/R';
import { CrossButton, PageInfo } from '../../../Components';
import { strings } from '../../../utility/locales/i18n';

export default class AppointmentGuideline extends React.Component {
  onCrossClicked = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <ScrollView
        style={Styles.containerStyle}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ marginLeft: -5 }}>
          <CrossButton onCrossClicked={() => this.onCrossClicked()} />
        </View>
        <PageInfo
          info={'Appointment Guidelines'}
          style={{ fontSize: 30, marginTop: 10, marginLeft: 0, color: 'black' }}
        />

        <View style={{ marginTop: 10 }}>
          <Text style={[Styles.titleStyle, { fontWeight: 'bold' }]}>
            {strings('appointmentGuideLine.message')}
          </Text>

          <Text style={[Styles.titleStyle, { marginTop: 40 }]}>
            Guidelines for scheduling:
          </Text>

          <Text style={Styles.textStyle}>
            {strings('appointmentGuideLine.1')}
          </Text>

          <Text style={Styles.textStyle}>
            {strings('appointmentGuideLine.2')}
          </Text>

          <Text style={Styles.textStyle}>
            {strings('appointmentGuideLine.3')}
          </Text>

          <Text style={Styles.textStyle}>
            {strings('appointmentGuideLine.4')}
          </Text>

          <Text style={Styles.textStyle}>
            {strings('appointmentGuideLine.5')}
          </Text>
        </View>
      </ScrollView>
    );
  }
}
