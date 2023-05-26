// Prod configuration 2461598263

const configuration = {
  PROD: {
    Auth: {
      // REQUIRED - Amazon Cognito Identity Pool ID
      identityPoolId: "us-west-2:23113b82-71e8-4b3d-90e7-8845ec4bb208",
      // REQUIRED - Amazon Cognito Region
      region: "us-west-2",
      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: "us-west-2_rpsYorR5P",
      // OPTIONAL - Amazon Cognito Web Client ID
      userPoolWebClientId: "7vmoi6fobmhsa7ucl4euv91css",
    },
    API: {
      aws_appsync_graphqlEndpoint:
        "https://j2tlkuqzp5g5thdxsealhpfpzu.appsync-api.us-west-2.amazonaws.com/graphql",

      aws_appsync_region: "us-west-2",

      aws_appsync_authenticationType: "vikingHealth-prod-user-pool",
    },
  },

  DEV: {
    Auth: {
      // REQUIRED - Amazon Cognito Identity Pool ID
      identityPoolId: "us-west-2:23113b82-71e8-4b3d-90e7-8845ec4bb208",
      // REQUIRED - Amazon Cognito Region
      region: "us-west-2",
      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: "us-west-2_YGNgNuQSL",
      // OPTIONAL - Amazon Cognito Web Client ID
      userPoolWebClientId: "1e2gi1ven3s9mf4ch352i72v8f",
    },
    API: {
      aws_appsync_graphqlEndpoint:
        "https://l52yqsqdv5bvppaqts5pbwjzeq.appsync-api.us-west-2.amazonaws.com/graphql",

      aws_appsync_region: "us-west-2",

      aws_appsync_authenticationType: "vikingHealth-test-user-pool",
    },
  },
};

export default configuration.PROD;
