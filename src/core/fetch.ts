import axios, { AxiosResponse } from 'axios';
import { Utils } from "./utils";
import { env, auth } from "../constants";

export namespace Fetch {
    export class AccessToken {
        constructor(
            public readonly token: string,
            public readonly type: string = "Bearer"
        ) {}
    
        get authorizationHeader(): string {
            return `${this.type} ${this.token}`;
        }
    }
    
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