import gql from 'graphql-tag';

export const TokenForVideoCall = gql`
  query TokenForVideoCall($userId: String!) {
    tokenForVideoCall(userId: $userId) {
      httpStatus
      errorCode
      errorMessage
      data {
        sessionId
        token
        expiryTime
      }
    }
  }
`;

export const VideoCallList = gql`
  query videoCallList($userId: String!) {
    videoCallList(userId: $userId) {
      userId
      duration
      archiveId
      storageKey
      sessionId
      size
      status
      createdAt
      updatedAt
      bucketName
    }
  }
`;

export const VideoPresignedURL = gql`
  query getVideoUrl($videoKey: String!) {
    getVideoUrl(videoKey: $videoKey) {
      url
    }
  }
`;

export const HideVideo = gql`
  mutation hideVideo($userId: String!, $archiveId: String!) {
    hideVideo(userId: $userId, archiveId: $archiveId) {
      sessionId
    }
  }
`;

export const ShowVideo = gql`
  mutation enableVideo($userId: String!, $archiveId: String!) {
    enableVideo(userId: $userId, archiveId: $archiveId) {
      sessionId
    }
  }
`;
