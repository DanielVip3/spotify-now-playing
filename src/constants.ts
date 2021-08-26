import { load } from 'ts-dotenv';

const env = load({
    SPOTIFY_CLIENT_ID: String,
    SPOTIFY_CLIENT_SECRET: String,
    SPOTIFY_ACCOUNTS_ENDPOINT: String,
    SPOTIFY_API_ENDPOINT: String,
    SPOTIFY_REFRESH_TOKEN: String,
});

const auth: string = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

export {
    env,
    auth
};