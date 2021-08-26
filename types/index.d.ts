export {};

declare global {
    namespace SpotifyApi {
        interface AccessTokenResponse {
            /**
             * An optional error than can occur, undefined if no error occurred.
             */
            error?: string;
    
            /** 
             * An access token that can be provided in subsequent calls, for example to Spotify Web API services.
             */
            access_token?: string;
    
            /**
             * How the access token may be used: always "Bearer".
             */
            token_type?: string;
    
            /**
             * A space-separated list of scopes which have been granted for this access_token
             */
            scope?: string;

            /**
             * The time period (in seconds) for which the access token is valid. 
             */
            expires_in?: number;
        }

        interface RecentlyPlayedObject {
            /**
             * Contains an array of play history objects (wrapped in a cursor-based paging object).
             */
            items: PlayHistoryObject[];
        }
    }
}