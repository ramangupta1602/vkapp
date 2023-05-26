import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { Query } from "react-apollo";
import * as MealIntakeQueries from "AppSyncQueries/MealIntakeQueries";
import ApprovedFoodListComponent from "./ApprovedFoodListComponent";
import { R } from "Resources";
import { PageTitle, CrossButton } from "Components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { strings } from "../../utility/locales/i18n";

export class ApprovedFoodList extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    // show list only from cache, but also refresh it from network.
    this.isLoadedOneTimeFromCache = false;
  }

  getApprovedFoodList = () => {
    return (
      <Query
        query={MealIntakeQueries.GetApprovedFoodList}
        fetchPolicy="cache-and-network">
        {({ data }) => {
          if (data) {
            const stringCategory = data.getApprovedFoodList;

            if (!stringCategory) {
              //received an empty object .. first time case.
              return (
                <View style={styles.loadingIndicatorContainerStyle}>
                  <ActivityIndicator />
                </View>
              );
            }

            this.isLoadedOneTimeFromCache = true;
            const category = JSON.parse(stringCategory).categories;
            return (
              <ApprovedFoodListComponent
                data={category}
                navigation={this.props.navigation}
                loading={false}
              />
            );
          }

          return (
            <View style={styles.loadingIndicatorContainerStyle}>
              <ActivityIndicator />
            </View>
          );
        }}
      </Query>
    );
  };

  render() {
    return (
      <View style={styles.containerStyle}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}>
          <View style={{ backgroundColor: "transparent", flex: 1 }}>
            <View style={[R.AppStyles.headerContainer]}>
              <CrossButton
                onCrossClicked={() => this.props.navigation.goBack()}
              />

              <View
                style={[
                  styles.headerContainer,
                  { marginLeft: -10, marginTop: 30 },
                ]}>
                <PageTitle title={strings("meal_intake.approved_food_list")} />
              </View>
            </View>

            {this.getApprovedFoodList()}
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
