import SpotifyWebApi from 'spotify-web-api-node'
const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET

const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming",
  "user-read-private",
  "user-top-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
].join(',')

const params = {
  scope: scopes,
}

const queryParamString = new URLSearchParams(params);
const LOGIN_URL = 
  `https://accounts.spotify.com/authorize?${queryParamString.toString()}`

const spotifyApi = new SpotifyWebApi({
  clientId: client_id ?? '',
  clientSecret: client_secret ?? ''
})



export default spotifyApi
export { LOGIN_URL }