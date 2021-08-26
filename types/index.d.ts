export {};

declare global {
    namespace SpotifyApi {
        interface AccessTokenResponse {
            error?: string;
    
            access_token?: string;
    
            token_type?: string;
    
            scope?: string;
    
            expires_in?: number;
        }

        interface RecentlyPlayedObject {
            items: PlayHistoryObject[];
        }
    }
}