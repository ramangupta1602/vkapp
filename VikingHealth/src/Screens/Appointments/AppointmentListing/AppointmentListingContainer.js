import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { AppointmentItem } from '../Components/AppointmentItem/AppointmentItem';
import { EmptyState } from '../Components/EmptyState/EmptyState';
import { inject, observer } from 'mobx-react';
import { Query } from 'react-apollo';
import * as AppointmentQueries from '../../../AppSyncQueries/AppointmentQueries';
import { USER_TYPE } from '../../../Library/Constants';
import { withNavigation } from 'react-navigation';
import { GamificationModal } from '../../../Components';
import { Gamification as GamificationConstant } from '../../../utility/constants/Constants';

const { width } = Dimensions.get('screen');

@inject('userAccountStore', 'loginUserStore', 'gamificationStore')
@observer
class AppointmentListingContainer extends Component {
  constructor(props) {
    super(props);

    this.highlight = props.highlight;

    this.state = {
      shouldShowRemainderModal: false,
    };
  }

  showRemainderModal = () => {
    setTimeout(() => {
      this.setState({ shouldShowRemainderModal: true });
    }, 2000);
  };

  hideRemainderModal = () => {
    this.setState({ shouldShowRemainderModal: false });
  };

  forceRefreshList = () => {
    if (this.refetch) {
      this.refetch();
    }
  };

  /**
   * Footer for flat list, will show progress at footer till data is loaded
   **/
  renderFooter = () => {
    return (
      <View>
        <ActivityIndicator color='black' style={{ marginLeft: 8 }} />
      </View>
    );
  };

  handleApiResponse = ({ loading, error, fetchMore, data }) => {
    const { userType } = this.props.loginUserStore;
    const { listType, navigation } = this.props;
    const isAdmin = userType === USER_TYPE.ADMIN;

    if (
      data &&
      (data.getAppointmentListForAdmin != null ||
        data.getAppointmentListForPatient != null)
    ) {
      const appointmentRes = data;
      const appointments =
        appointmentRes.getAppointmentListForAdmin ??
        appointmentRes.getAppointmentListForPatient;
      const appointmentData = appointments.appointments;
      const nextToken = appointments.nextToken;

      const extraData = JSON.stringify(appointments);

      return (
        <View style={{ flex: 1, width }}>
          {appointmentData.length > 0 && (
            <FlatList
              contentContainerStyle={{ paddingBottom: 80 }}
              extraData={extraData}
              showsVerticalScrollIndicator={true}
              data={appointmentData}
              renderItem={({ index, item }) => {
                return (
                  <AppointmentItem
                    showRemainderModal={this.showRemainderModal}
                    navigation={navigation}
                    appointmentDetails={item}
                    isAdmin={isAdmin}
                    refreshList={this.forceRefreshList}
                    changeTab={this.props.changeTab}
                    highlight={this.highlight}
                  />
                );
              }}
              keyExtractor={(item, index) => {
                return item.appointmentId;
              }}
              // ItemSeparatorComponent={(item, index) => {
              //   return <View style={{ height: 16 }} />;
              // }}
              onEndReachedThreshold={0.2}
              onEndReached={() => {
                if (!nextToken) {
                  return;
                }

                fetchMore({
                  variables: {
                    nextToken,
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    appointmentRes.getAppointmentListForAdmin.nextToken =
                      fetchMoreResult.getAppointmentListForAdmin.nextToken;

                    const obj = {
                      appointments: [
                        ...prev.getAppointmentListForAdmin.appointments,
                        ...fetchMoreResult.getAppointmentListForAdmin.appointments.filter(
                          (n) =>
                            !prev.getAppointmentListForAdmin.appointments.some(
                              (p) => p.appointmentId === n.appointmentId
                            )
                        ),
                      ],
                    };
                    appointmentRes.getAppointmentListForAdmin.appointments =
                      obj.appointments;
                    return appointmentRes;
                  },
                });
              }}
            />
          )}

          {appointmentData.length <= 0 && <EmptyState type={listType} />}

          {loading && appointmentData.length > 0 && this.renderFooter()}
        </View>
      );
    } else {
      return <EmptyState type={listType} />;
    }
  };

  render() {
    const { userType } = this.props.loginUserStore;
    const { username: userId, fullName } = this.props.userAccountStore;
    const { listType, navigation } = this.props;
    const isAdmin = userType === USER_TYPE.ADMIN;
    const { shouldShowRemainderModal } = this.state;

    const parameter = {
      type: listType,
      limit: 10,
      token: null,
    };

    return (
      <View
        style={{
          marginBottom: 22,
          marginTop: 8,
        }}
      >
        {isAdmin && (
          <Query
            query={AppointmentQueries.GetAppointmentListForAdmin}
            variables={parameter}
            fetchPolicy='cache-and-network'
          >
            {({ loading, error, fetchMore, data, refetch }) => {
              this.refetch = refetch;
              return this.handleApiResponse({
                loading,
                error,
                fetchMore,
                data,
              });
            }}
          </Query>
        )}

        {!isAdmin && (
          <Query
            query={AppointmentQueries.GetAppointmentListForPatient}
            variables={{
              patientId: userId,
              type: listType,
            }}
            fetchPolicy='cache-and-network'
          >
            {({ loading, error, fetchMore, data, refetch }) => {
              this.refetch = refetch;

              return this.handleApiResponse({
                loading,
                error,
                fetchMore,
                data,
              });
            }}
          </Query>
        )}

        <GamificationModal
          isVisible={shouldShowRemainderModal}
          onBackdropPress={() => {}}
          modalName={GamificationConstant.Appointment.RescheduleRemainder}
          onClick={this.hideRemainderModal}
          patientId={userId}
          fullName={fullName}
        />
      </View>
    );
  }
}

export default withNavigation(AppointmentListingContainer);
