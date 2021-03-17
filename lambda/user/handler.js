const AWS = require('aws-sdk');
const axios = require('axios');

const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const TABLE_NAME = 'User';
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
      TableName: TABLE_NAME,
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

    // Save to dynamoDB
    const result = JSON.stringify(
      {
        message: spotifyData,
        input: event,
      },
    );

    return {
      statusCode: 200,
      body: result,
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
