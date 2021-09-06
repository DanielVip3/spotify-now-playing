import { env } from "../../constants";
import { Fetch } from "../../core/fetch";
import { Utils } from "../../core/utils";

import Song from '../data/Song';

export default class PlayController {
    /**
     * Gets the currently playing track from Spotify's API and returns them as a readable {@link Song} object.
     * @returns a {@link Song} object, or undefined if nothing is found.
     */
    static async getCurrentlyPlaying(): Promise<Song|undefined> {
        const currentlyPlaying = await Fetch.getCurrentlyPlaying(await Fetch.getAccessToken(), Fetch.getAccessToken);
        if (!currentlyPlaying) return undefined;

        const track: SpotifyApi.TrackObjectFull = currentlyPlaying.item as SpotifyApi.TrackObjectFull;
        if (!track) return undefined;

        return {
            userUrl: env.SPOTIFY_USER_URL,
            name: track.name,
            url: track.href,
            author: track.artists[0].name,
            album: track.album.name,
            albumImageUrl: track.album.images[0].url,
            durationMs: track.duration_ms,
            listening: true,
        } as Song;
    }

    /**
     * Gets the last recently played track from Spotify's API and returns them as a readable {@link Song} object.
     * @returns a {@link Song} object, or undefined if nothing is found.
     */
    static async getRecentlyPlayed(): Promise<Song|undefined> {
        const accessToken = await Fetch.getAccessToken();

        const recentlyPlayed = await Fetch.getRecentlyPlayed(accessToken, Fetch.getAccessToken);
        if (!recentlyPlayed) return undefined;

        const lastRecentlyPlayed: SpotifyApi.PlayHistoryObject = Utils.getLastRecentlyPlayed(recentlyPlayed);

        const track = await Fetch.getFullTrack(lastRecentlyPlayed.track.id, accessToken, Fetch.getAccessToken);
        if (!track) return undefined;

        return {
            userUrl: env.SPOTIFY_USER_URL,
            name: track.name,
            url: track.href,
            author: track.artists[0].name,
            album: track.album.name,
            albumImageUrl: track.album.images[0].url,
            durationMs: track.duration_ms,
            listening: true,
        } as Song;
    }

    /**
     * Gets the last track, prioritizing the one that is actually playing, and if it isn't found, gets the last played one.
     * @returns a {@link Song} object, or undefined if nothing is found.
     */
    static async getLastPlay() {
        return await this.getCurrentlyPlaying() || await this.getRecentlyPlayed() || undefined;
    }
};