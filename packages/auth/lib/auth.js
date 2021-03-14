/**
 * Use the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();

if (dotenv.error) {
  throw dotenv.error;
}

const port = process.env.FWB_AUTH_PORT;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectURI = `${process.env.FWB_URL}:${process.env.FWB_AUTH_PORT}/${process.env.SPOTIFY_REDIRECT_URI}`; // (find in Spotify dashboard)

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

const app = express();

app
  .use(express.static(`${__dirname}/public`))
  .use(cors())
  .use(cookieParser());

/* Application requests authorization */
app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // more scopes available at https://developer.spotify.com/documentation/general/guides/scopes/
  const scope = 'user-read-private user-read-email user-top-read playlist-modify-public playlist-read-collaborative';
  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope,
      redirect_uri: redirectURI,
      state,
    })}`,
  );
});

/* Appication requests refresh and access tokens
  after checking the state parameter */
app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.json({
      error: 'state_mismatch',
    });
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri: redirectURI,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`,
        ).toString('base64')}`,
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const { accessToken } = body;
        const { refreshToken } = body;

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: `Bearer ${accessToken}` },
          json: true,
        };

        let result;

        // use the access token to access the Spotify Web API
        request.get(options, (error, response, body) => {
          if (!error) {
            result = body;
            console.log(response.json());
            console.log(body);
          } else {
            console.log(error);
          }
        });

        // we can also pass the token to the browser to make requests from there
        res.json({
          info: result,
          accessToken,
          refreshToken,
        });
      } else {
        res.json({
          error: 'invalid_token',
        });
      }
    });
  }
});

/* Applicatin requests access token from refresh token */
app.get('/refresh_token', (req, res) => {
  const { refreshToken } = req.query;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`,
      ).toString('base64')}`,
    },
    form: {
      grant_type: 'refresh_token',
      refreshToken,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const { accessToken } = body;
      res.send({
        accessToken,
      });
    }
  });
});

app.listen(port, () => console.log(`Express server is running on port ${port}`));
