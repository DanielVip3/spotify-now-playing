export namespace Utils {
    /**
     * Tells if a request to Spotify's API was succesful or not and, most importantly, if data is available.
     * A status of 204 CONTENT NOT FOUND automatically means that data isn't available.
     * Otherwise, if a status of 200 OK is received, true will be returned but only if actual data is available.
     * Any other status is not expected and will mean that data isn't available.
     * @param status - the API response's HTTP status.
     * @param data - the API response's JSON payload (body).
     * @returns a boolean, telling if response was OK and data is available.
     */
    export function isDataAvailable(status: number, data: any): boolean {
        switch(status) {
            case 200: // OK
                return !!data && (Array.isArray(data) ? data.length > 1 : true);
            default: // any other status
            case 204: // CONTENT NOT FOUND
                return false;
        }
    }
    
    /**
     * Gets the last recently played track from a {@link SpotifyApi.RecentlyPlayedObject}'s items array.
     * This is accomplished by descending sorting tracks by date, and then taking the first one.
     * If there are no recently played tracks, undefined will be returned.
     * @param recentlyPlayed - a {@link SpotifyApi.RecentlyPlayedObject} that contains an array of recently played tracks in the "items" field.
     * @returns a {@link SpotifyApi.PlayHistoryObject} (basically, a track's data) if at least a track was in the array, otherwise undefined.
     */
    export function getLastRecentlyPlayed(recentlyPlayed?: SpotifyApi.RecentlyPlayedObject): SpotifyApi.PlayHistoryObject|undefined {
        if (!recentlyPlayed || !recentlyPlayed.items || !Array.isArray(recentlyPlayed.items) || recentlyPlayed.items.length <= 0) return undefined;
        if (recentlyPlayed.items.length === 1) return recentlyPlayed.items[0];
    
        return recentlyPlayed.items.sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime())[0];
    }
}