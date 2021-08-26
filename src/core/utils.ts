export namespace Utils {
    export function isDataAvailable(status: number, data: any): boolean {
        switch(status) {
            case 200: // OK
                return !!data && (Array.isArray(data) ? data.length > 1 : true);
            default: // any other status
            case 204: // CONTENT NOT FOUND
                return false;
        }
    }
    
    export function getLastRecentlyPlayed(recentlyPlayed?: SpotifyApi.RecentlyPlayedObject): SpotifyApi.PlayHistoryObject|undefined {
        if (!recentlyPlayed || !recentlyPlayed.items || !Array.isArray(recentlyPlayed.items) || recentlyPlayed.items.length <= 0) return undefined;
        if (recentlyPlayed.items.length === 1) return recentlyPlayed.items[0];
    
        return recentlyPlayed.items.sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime())[0];
    }
}