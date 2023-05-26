import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { R } from 'Resources';
import { strings } from '../../utility/locales/i18n';
import { UnitSelection } from 'Components';
import * as UserQueries from 'AppSyncQueries/UserQueries';
import { Mutation } from 'react-apollo';
import { inject, observer } from 'mobx-react';

@observer
@inject('loginUserStore')
export class MeasurementUnit extends Component {
  static navigationOptions = {
    header: null
  };

  updateWeightUnit = (proxy, { data: { updateWeightUnit } }) => {
    this.props.loginUserStore.setDisplayWeightUnit(
      updateWeightUnit.displayWeightUnit
    );
    const query = UserQueries.GetProfile;
    let userId = this.props.loginUserStore.userId;

    try {
      let data = proxy.readQuery({
        query: query,
        variables: { userId: userId }
      });
      if (data && data.getProfile) {
        data.getProfile.displayWeightUnit = updateWeightUnit.displayWeightUnit;
        proxy.writeQuery({ query: query, variables: { userId: userId }, data });
      }
    } catch (e) {
      console.log('EXCEPTION isGetProfileQueryAvailable: ', e.message);
    }
  };

  updateHeightUnit = (proxy, { data: { updateHeightUnit } }) => {
    this.props.loginUserStore.setDisplayHeightUnit(
      updateHeightUnit.displayHeightUnit
    );
    const query = UserQueries.GetProfile;
    let userId = this.props.loginUserStore.userId;

    try {
      let data = proxy.readQuery({
        query: query,
        variables: { userId: userId }
      });
      if (data && data.getProfile) {
        data.getProfile.displayHeightUnit = updateHeightUnit.displayHeightUnit;
        proxy.writeQuery({ query: query, variables: { userId: userId }, data });
      }
    } catch (e) {
      console.log('EXCEPTION isGetProfileQueryAvailable: ', e.message);
    }
  };

  render() {
    const {
      displayWeightUnit,
      displayHeightUnit,
      userId
    } = this.props.loginUserStore;
    const {
      onWeightUnitChange = () => {}
    } = this.props;
    return (
      <View>
        <Text style={styles.header}>
          {strings('profile.unit_of_measurement')}{' '}
        </Text>
        <View
          style={{
            marginTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Text style={styles.unitType}>{strings('profile.body_weight')}</Text>
          <Mutation mutation={UserQueries.UpdateWeightUnit}>
            {(updateUnit, { loading, error, data }) => {
              return (
                <UnitSelection
                  firstTab={strings('common_message.kg').toUpperCase()}
                  secondTab={strings('common_message.lb').toUpperCase()}
                  isFirstTabSelected={displayWeightUnit == 0}
                  tabSelectionChanged={index => {
                    updateUnit({
                      variables: {
                        weightUnit: index
                      },
                      optimisticResponse: {
                        __typename: 'Mutation',
                        updateWeightUnit: {
                          __typename: 'Patient',
                          displayWeightUnit: index,
                          userId: userId
                        }
                      },
                      update: this.updateWeightUnit
                    });
                    onWeightUnitChange()
                  }}
                />
              );
            }}
          </Mutation>
        </View>
        <View
          style={{
            marginTop: 34,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Text style={styles.unitType}>
            {strings('profile.body_measurement')}
          </Text>
          <Mutation mutation={UserQueries.UpdateHeightUnit}>
            {(updateUnit, { loading, error, data }) => {
              return (
                <UnitSelection
                  firstTab={strings('common_message.in').toUpperCase()}
                  secondTab={strings('common_message.cm').toUpperCase()}
                  isFirstTabSelected={displayHeightUnit == 0}
                  tabSelectionChanged={index => {
                    updateUnit({
                      variables: {
                        heightUnit: index
                      },
                      optimisticResponse: {
                        __typename: 'Mutation',
                        updateHeightUnit: {
                          __typename: 'Patient',
                          displayHeightUnit: index,
                          userId: userId
                        }
                      },
                      update: this.updateHeightUnit
                    });
                  }}
                />
              );
            }}
          </Mutation>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.12,
    lineHeight: 17
  },
  unitType: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    fontWeight: '600'
    // marginLeft: 4
  }
});
