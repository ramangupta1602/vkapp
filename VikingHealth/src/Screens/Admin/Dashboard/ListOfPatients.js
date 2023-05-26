import React, { Component } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { StatusActiveCard } from "./StatusActiveCard";
import { StatusInviteCard } from "./StatusInviteCard";
import { STATUS_USER } from "Library/Constants";
import Toast from "react-native-easy-toast";
import { R } from "Resources";
import { styles } from "./Styles";

export class ListOfPatients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      nextToken: props.token,
      patientList: props.data,
    };
  }

  /**
   * Footer for flat list, will show progress at footer till data is loaded
   **/
  renderFooter() {
    return (
      //Footer View with Load More button
      this.state.isLoading && (
        <View>
          <ActivityIndicator color="black" style={{ marginLeft: 8 }} />
        </View>
      )
    );
  }

  /**
   * time delay for calling flat list when it reached at the end
   */
  delayEndOfFlatList() {
    setTimeout(() => {
      this.handleLoadMore();
    });
  }

  handleLoadMore() {
    if (this.props.token === null) {
      return;
    }
    if (!this.setState.isLoading) {
      this.setState({ isLoading: true });
      this.props.onLoadMore(this.props.token);
    }
  }

  invitationSentCallback(isSuccess, to, errorMessage) {
    if (isSuccess) {
      this.refs.toast.show(
        "Invitation has been sent successfully to " + to,
        2000
      );
    } else {
      if (errorMessage) {
        this.refs.errorToast.show(errorMessage, 2000);
      } else {
        this.refs.errorToast.show("Something went wrong.", 2000);
      }
    }
  }

  activateUserCallback(isSuccess, message) {
    if (isSuccess) {
      this.refs.toast.show(message, 2000);
    } else {
      this.refs.errorToast.show(message, 2000);
    }
  }

  renderItem(data) {
    if (data.status === STATUS_USER.INVITED) {
      return (
        <StatusInviteCard
          data={data}
          onClick={() => {
            this.props.navigate("PatientProfile");
          }}
          callback={this.invitationSentCallback.bind(this)}
        />
      );
    } else {
      return (
        <StatusActiveCard
          onClick={() => {
            this.props.navigate("PatientProfile");
          }}
          data={data}
          callback={this.activateUserCallback.bind(this)}
        />
      );
    }
  }

  componentWillReceiveProps() {
    this.setState({ isLoading: false });
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

  /**
   * rendering patients list
   */
  renderPatientsList() {


    return (
      <FlatList
        style={{ paddingHorizontal: 16 }}
        data={this.props.data}
        renderItem={({ item }) => this.renderItem(item)}
        keyExtractor={(i) => i.userId}
        extraData={this.state}
        ListFooterComponent={() => this.renderFooter()}
        onEndReachedThreshold={0.2}
        extraData={this.state}
        onEndReached={() => this.delayEndOfFlatList()}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderPatientsList()}
        {this.renderToast()}
        {this.renderErrorToast()}
      </View>
    );
  }
}
