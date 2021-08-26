import { load } from 'ts-dotenv';

/**
 * Environment variables' declared types, actual variables are in .env file.
 */
const env = load({
    SPOTIFY_CLIENT_ID: String,
    SPOTIFY_CLIENT_SECRET: String,
    SPOTIFY_ACCOUNTS_ENDPOINT: String,
    SPOTIFY_API_ENDPOINT: String,
    SPOTIFY_REFRESH_TOKEN: String,
});

/**
 * The authentication constant, which is Spotify app's client id and secret, separed by a colon, encoded in base64.
 */
const auth: string = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

export {
    env,
    auth
};