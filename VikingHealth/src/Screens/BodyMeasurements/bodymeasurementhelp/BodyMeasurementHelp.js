import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { PageTitle, CrossButton } from 'Components';
import { strings } from '../../../utility/locales/i18n';
import { BodyPartMeasurement } from './BodyPartMeasurement';
import { R } from 'Resources';

export class BodyMeasurementHelp extends Component {
  static navigationOptions = {
    header: null
  };

  onCrossClicked() {
    if (this.props.onCrossClicked) {
      this.props.onCrossClicked();
    }
  }

  render() {
    return (
      <ScrollView
        style={{
          backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
          paddingBottom: 30
        }}
      >
        <View style={styles.container}>
          <View
            style={{
              paddingLeft: 18,
              marginTop: 10,
              marginBottom: 16
            }}
          >
            <CrossButton onCrossClicked={() => this.onCrossClicked()} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <PageTitle
              title={strings(
                'body_measurement_help.how_to_take_body_measurement'
              )}
            />
          </View>
          <View style={{ marginTop: 23, marginLeft: 16, marginRight: 16 }}>
            <BodyPartMeasurement
              image={R.Images.neck}
              header={strings('body_measurement.neck')}
              description={strings(
                'body_measurement_help.neck_measurement_desc'
              )}
            />
            <BodyPartMeasurement
              image={R.Images.shoulder}
              header={strings('body_measurement.shoulder')}
              description={strings(
                'body_measurement_help.shoulder_measurement_desc'
              )}
            />
            <BodyPartMeasurement
              image={R.Images.chest}
              header={strings('body_measurement.chest')}
              description={strings(
                'body_measurement_help.chest_measurement_desc'
              )}
            />
            <BodyPartMeasurement
              image={R.Images.upperarms}
              header={strings('body_measurement_help.upper_arms')}
              description={strings('body_measurement_help.upper_arms_desc')}
            />
            <BodyPartMeasurement
              image={R.Images.waist}
              header={strings('body_measurement.waist')}
              description={strings('body_measurement_help.waist_desc')}
            />
            <BodyPartMeasurement
              image={R.Images.hips}
              header={strings('body_measurement.hips')}
              description={strings('body_measurement_help.hips_desc')}
            />
            <BodyPartMeasurement
              image={R.Images.thighs}
              header={strings('body_measurement.thighs')}
              description={strings('body_measurement_help.thigh_desc')}
            />
            <BodyPartMeasurement
              image={R.Images.calf}
              header={strings('body_measurement.calf')}
              description={strings('body_measurement_help.calf_desc')}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: 'flex-start',
    flex: 1,
    paddingTop: 29,
    paddingBottom: 40
  },
  imageCross: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
    marginBottom: 16
  }
});
