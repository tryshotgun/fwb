const AWS = require('aws-sdk');
const axios = require('axios');

const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const AWS_DB_TABLE_NAME = 'User';
const AWS_SCAN_FOR_ALL_ATTRIBUTES = 'ALL_ATTRIBUTES';
const SPOTIFY_CURRENT_USER_INFO_URL = 'https://api.spotify.com/v1/me';

/**
 * Create a new user if user doesn't exist
 * @throws ConditionalCheckFailedException if user exists
*/
module.exports.createNewUser = async (event) => {
  try {
    let authToken;
    if (event.queryStringParameters && event.queryStringParameters.authorization_token) {
      authToken = event.queryStringParameters.authorization_token;
    }

    // Formulate header
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
    };

    // Create a query to Spotify API to grab basic info
    const spotifyData = await axios.get(SPOTIFY_CURRENT_USER_INFO_URL, options)
      .then((response) => response.data)
      .catch((error) => error);

    const params = {
      TableName: AWS_DB_TABLE_NAME,
      Item: {
        spotify_id: +spotifyData.id,
        country_code: spotifyData.country,
        display_name: spotifyData.display_name,
        email: spotifyData.email,
        profile_image_url: spotifyData.images[0].url,
        user_profile_url: spotifyData.external_urls.spotify,
        created_dt_tm: String(Date.now()),
      },
      ConditionExpression: 'attribute_not_exists(spotify_id)',
    };

    // AWS dynamoDB operation
    await docClient.put(params).promise();

    return {
      statusCode: 200,
      body: 'Success',
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: error,
          input: event,
        },
      ),
    };
  }
};

/** Get user information */
module.exports.getUserInfo = async (event) => {
  try {
    let authToken;
    if (event.queryStringParameters && event.queryStringParameters.authorization_token) {
      authToken = event.queryStringParameters.authorization_token;
    }

    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      json: true,
    };

    // use the access token to access the Spotify Web API
    const spotifyData = await axios.get(SPOTIFY_CURRENT_USER_INFO_URL, options)
      .then((response) => response.data)
      .catch((error) => error);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          result: spotifyData,
          input: event,
        },
      ),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: error,
          input: event,
        },
      ),
    };
  }
};

/** Get all users */
module.exports.getAllUsers = async (event) => {
  try {
    // let authToken;
    // if (event.queryStringParameters && event.queryStringParameters.authorization_token) {
    //   authToken = event.queryStringParameters.authorization_token;
    // }

    // TODO
    // Check whether auth token is still valid

    const params = {
      TableName: AWS_DB_TABLE_NAME,
      Select: AWS_SCAN_FOR_ALL_ATTRIBUTES,
    };

    const allUsers = await docClient.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          result: allUsers,
          input: event,
        },
      ),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: error,
          input: event,
        },
      ),
    };
  }
};
