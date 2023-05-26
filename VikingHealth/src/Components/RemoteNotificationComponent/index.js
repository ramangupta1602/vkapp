import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { inject, observer } from "mobx-react";
import { Query, Mutation } from "react-apollo";
import * as UserQueries from "../../AppSyncQueries/UserQueries";

@inject("userAccountStore")
@observer
export default class RemoteNotificationComponent extends Component {
	render() {
		const userId = this.props.userAccountStore.username;

		return (
			<View>
				<Mutation
					mutation={UserQueries.PublishNotification}
					onError={(error) => {
						console.log("error is", error);
					}}
					onCompleted={() => {
						console.log("push notification request sent");
					}}
				>
					{(sendNotificationToUser) => {
						return (
							<TouchableOpacity
								onPress={() => {
									sendNotificationToUser({
										variables: {
											user_id: userId,
										},
									});
								}}
							>
								<Text>Send Notificaiton</Text>
							</TouchableOpacity>
						);
					}}
				</Mutation>
			</View>
		);
	}
}
