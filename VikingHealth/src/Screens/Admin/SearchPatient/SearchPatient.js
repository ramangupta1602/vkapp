import React, { Component } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
import { BackButton } from "Components";
import { styles } from "./Styles";
import { StatusActiveCard } from "../Dashboard/StatusActiveCard";
import { StatusInviteCard } from "../Dashboard/StatusInviteCard";
import { STATUS_USER } from "Library/Constants";
import * as UserQueries from "AppSyncQueries/UserQueries";
import { inject, observer } from "mobx-react";
import { ApolloConsumer } from "react-apollo";
import { appsyncClient } from "../../../../App";
import Toast, { DURATION } from "react-native-easy-toast";
import { R } from "Resources";

@inject("userAccountStore")
@observer
export class SearchPatient extends Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      isLoading: false,
      errorMessage: "Enter name to search patient",
      reloadScreen: false
    };
  }

  componentDidMount = async () => {
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        const reloadScreen = this.props.navigation.getParam("reloadScreen");
        if (reloadScreen === true) {
          this.callSearchAPI(appsyncClient);
        }
      }
    );
  };

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  invitationSentCallback(isSuccess, to, errorMessage) {
    if (isSuccess) {
      this.refs.toast.show(
        `Invitation has been sent successfully to ${to}`,
        2000
      );
    } else {
      this.refs.errorToast.show(errorMessage, 2000);
    }
  }

  callSearchAPI = async client => {
    this.setState({ isLoading: true, errorMessage: "", reloadScreen: false });
    const { data, errors, loading } = await client.query({
      query: UserQueries.SearchPatient,
      variables: {
        search: this.state.searchText
      },
      fetchPolicy: "network-only"
    });

    if (data) {
      this.patientSearch(data);
    }
    if (errors) {
      this.setState({ isLoading: false });
    }
  };

  activateUserCallback(isSuccess, message) {
    if (isSuccess) {
      this.refs.toast.show(message, 2000);
    } else {
      this.refs.errorToast.show(message, 2000);
    }
  }
  patientSearch(data) {
    this.setState({ isLoading: false });
    if (data && data.searchPatient && data.searchPatient.length > 0) {
      this.setState({ patientList: data.searchPatient });
    } else {
      this.setState({ errorMessage: "No patient found" });
    }
  }

  renderItem(data) {
    if (data.status === STATUS_USER.INVITED) {
      return (
        <StatusInviteCard
          data={data}
          onClick={() => {
            this.props.navigation.navigate("PatientProfile", {
              screenName: "search"
            });
          }}
          callback={this.invitationSentCallback.bind(this)}
        />
      );
    } else if (data.status === 4) {
      return null;
    }
    return (
      <StatusActiveCard
        onClick={() => {
          this.props.navigation.navigate("PatientProfile", {
            screenName: "search"
          });
        }}
        data={data}
        callback={this.activateUserCallback.bind(this)}
      />
    );
  }

  renderToast() {
    return (
      <Toast
        ref="toast"
        style={[R.ToastStyle.toastSuccessBackGround]}
        position="center"
        fadeInDuration={800}
        fadeOutDuration={1000}
        textStyle={styles.toastText}
      />
    );
  }

  renderErrorToast() {
    return (
      <Toast
        ref="errorToast"
        style={[R.ToastStyle.toastErrorBackGround]}
        position="center"
        fadeInDuration={800}
        fadeOutDuration={1000}
        textStyle={styles.toastText}
      />
    );
  }

  renderPatientsList() {
    if (this.state.patientList && this.state.patientList.length > 0) {
      return this.renderSearchedPatientsList();
    }
    return this.renderNoPatient();
  }

  renderSearchedPatientsList() {
    return (
      <FlatList
        style={{
          paddingHorizontal: 16,
          flex: 1
        }}
        data={this.state.patientList}
        renderItem={({ item }) => this.renderItem(item)}
        keyExtractor={i => i.userId}
      />
    );
  }

  renderNoPatient() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>{this.state.errorMessage}</Text>
      </View>
    );
  }

  //not reusing it as common component contains margin bottom which creates align issue
  renderBackButton() {
    return (
      <TouchableWithoutFeedback
        style={{ padding: 5 }}
        onPress={() => {
          this.props.navigation.goBack();
        }}>
        <Image source={R.Images.arrowLeft} style={styles.backButtonStyle} />
      </TouchableWithoutFeedback>
    );
  }
  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
                padding: 10
              }}>
              {this.renderBackButton()}
              <ApolloConsumer>
                {client => (
                  <TextInput
                    style={styles.searchInput}
                    onChangeText={textEntry => {
                      this.setState({ searchText: textEntry });
                    }}
                    value={this.state.text}
                    placeholder="Search for Patient.."
                    auto-capitalization={false}
                    onSubmitEditing={() => this.callSearchAPI(client)}
                    clearButtonMode="always"
                    autoFocus
                    clearTextOnFocus
                    onSelectionChange={() => this.renderPatientsList()}
                  />
                )}
              </ApolloConsumer>
            </View>
          </View>
          <View style={styles.wrapperPatient}>
            {this.renderPatientsList()}
            {this.renderToast()}
            {this.renderErrorToast()}
          </View>
          {this.state.isLoading && (
            <ActivityIndicator
              style={styles.progressBarStyle}
              size="large"
              color={R.Colors.COLOR_BLUE}
            />
          )}
        </View>
      </View>
    );
  }
}
