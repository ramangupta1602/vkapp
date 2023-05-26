import React from "react";
import { FlatList } from "react-native";
import { Query } from "react-apollo";
import * as VideoQueries from "AppSyncQueries/VideoQueries";
import CallListCard from "./CallListCard";
import { EmptyStateList } from "./EmptyStateList";

export const FetchCallListQuery = (props) => {
  return (
    <Query
      query={VideoQueries.VideoCallList}
      variables={{ userId: props.userId }}
      fetchPolicy="network-only">
      {({ loading, error, data }) => {
        if (data && data.videoCallList && data.videoCallList.length !== 0) {
          return (
            <FlatList
              style={{ paddingHorizontal: 16 }}
              data={data.videoCallList}
              renderItem={({ item }) => (
                <CallListCard
                  item={item}
                  isAdmin={props.isAdmin}
                  onSelectVideo={props.onSelectVideo}
                />
              )}
              keyExtractor={(i) => i.archiveId}
              onEndReachedThreshold={0.2}
            />
          );
        } else {
          return <EmptyStateList />;
        }
      }}
    </Query>
  );
};
