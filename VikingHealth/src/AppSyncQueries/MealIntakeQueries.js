import gql from 'graphql-tag';

export const GetApprovedFoodList = gql`
  query GetApprovedFoodList {
    getApprovedFoodList
  }
`;
