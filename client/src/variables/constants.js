const constants = {
  SPOTIFY_AUTH_URL: 'https://accounts.spotify.com/en/authorize?',
  CLIENT_ID: '18c72b0bdd2a4715b72814a5962ee5bf',
  REDIRECT_URI: 'http://localhost:3000/landing-page',
  SCOPE: 'user-read-private user-read-email',
  RESPONSE_TYPE: 'code',

  AUTH_API_HOST: 'http://localhost',
  AUTH_API_PORT: '8888',
  AUTH_API_ENDPOINT: '/callback?',
};

export default constants;
