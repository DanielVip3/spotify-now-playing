import axios, { AxiosResponse } from 'axios';
import { Utils } from "./utils";
import { env, auth } from "../constants";

export namespace Fetch {
    /**
     * Describes an access token, used in this namespace.
     */
    export class AccessToken {
        /**
         * @param token - The actual token, provided by Spotify's API.
         * @param type - How the access token may be used. It will always be "Bearer".
         */
        constructor(
            public readonly token: string,
            public readonly type: string = "Bearer"
        ) {}
    
        /**
         * The access token but pre-formatted to be used in the "Authorization" HTTP header.
         */
        get authorizationHeader(): string {
            return `${this.type} ${this.token}`;
        }
    }

    /**
     * Gets an access token from Spotify's API, using the constant refresh token.
     * @returns an {@link AccessToken} instance.
     * @throws an error, if refresh token is incorrect or something went wrong.
     */
    export async function getAccessToken(): Promise<AccessToken> {
        const tokenRes: AxiosResponse<SpotifyApi.AccessTokenResponse> = await axios.post(
            `${env.SPOTIFY_ACCOUNTS_ENDPOINT}/api/token`,
            new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: env.SPOTIFY_REFRESH_TOKEN
            }).toString(),
            {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            }
        );
    
        if (Utils.isDataAvailable(tokenRes.status, tokenRes.data) && !tokenRes.data.error) { // if we received the access token
            return new AccessToken(tokenRes.data.access_token, tokenRes.data.token_type);
        } else { // if we have no access token
            if (tokenRes?.data?.error) throw new Error(tokenRes.data.error);
            else if (tokenRes.status !== 200) throw new Error(`Access token error: status ${tokenRes.status}`);
            else throw new Error(`Access token error: unknown error, data unavailable`);
        }
    }
    
    /**
     * Gets the recently played tracks from Spotify's API, on behalf of the user account owner of the access token.
     * @param accessToken - an {@link AccessToken} instance.
     * @param refreshAccessToken - a method that will be called (a single time) when the access token results expired, to refresh it. Must return an {@link AccessToken}.
     * @returns a {@link SpotifyApi.RecentlyPlayedObject}, or undefined if nothing is found or the access token results expired and can't be refreshed.
     * @throws an error, if something goes wrong, but NOT if the access token is expired and can't be refreshed. No error will be thrown in that case, and undefined will be returned.
     */
    export async function getRecentlyPlayed(
            accessToken?: AccessToken, refreshAccessToken?: () => Promise<AccessToken|undefined>
        ): Promise<SpotifyApi.RecentlyPlayedObject|undefined> {
        
        if (!accessToken) return undefined;
    
        try {
            const playedRes: AxiosResponse<SpotifyApi.RecentlyPlayedObject> = await axios.get(`${env.SPOTIFY_API_ENDPOINT}/v1/me/player/recently-played`, {
                headers: {
                    Authorization: accessToken.authorizationHeader
                },
                responseType: 'json',
            });
    
            if (Utils.isDataAvailable(playedRes.status, playedRes.data)) {
                return playedRes.data;
            } else {
                if (playedRes.status !== 200) return undefined;
                else throw new Error("Recently played request error: unknown error, data unavailable");
            }
        } catch(err) {
            if (err?.response?.data?.error && err.response.data.error.status >= 300) {
                return refreshAccessToken ? await getRecentlyPlayed(await refreshAccessToken(), async() => undefined) : undefined;
            } else throw err;
        }
    }
    
    /**
     * Gets the currently playing track from Spotify's API, on behalf of the user account owner of the access token.
     * @param accessToken - an {@link AccessToken} instance.
     * @param refreshAccessToken - a method that will be called (a single time) when the access token results expired, to refresh it. Must return an {@link AccessToken}.
     * @returns a {@link SpotifyApi.CurrentlyPlayingObject}, or undefined if no track is playing currently, nothing is found or the access token results expired and can't be refreshed.
     * @throws an error, if something goes wrong, but NOT if the access token is expired and can't be refreshed. No error will be thrown in that case, and undefined will be returned.
     */
    export async function getCurrentlyPlaying(
            accessToken?: AccessToken, refreshAccessToken?: () => Promise<AccessToken|undefined>
        ): Promise<SpotifyApi.CurrentlyPlayingObject|undefined> {
        
        if (!accessToken) return undefined;
    
        try {
            const playingRes: AxiosResponse<SpotifyApi.CurrentlyPlayingObject> = await axios.get(`${env.SPOTIFY_API_ENDPOINT}/v1/me/player/currently-playing`, {
                headers: {
                    Authorization: accessToken.authorizationHeader
                },
                responseType: 'json',
            });
        
            if (Utils.isDataAvailable(playingRes.status, playingRes.data)) {
                return playingRes.data;
            } else {
                if (playingRes.status !== 200) return undefined;
                else throw new Error("Currently playing request error: unknown error, data unavailable");
            }
        } catch(err) {
            if (err?.response?.data?.error && err.response.data.error.status >= 300) {
                return refreshAccessToken ? await getCurrentlyPlaying(await refreshAccessToken(), async() => undefined) : undefined;
            } else throw err;
        }
    }
}