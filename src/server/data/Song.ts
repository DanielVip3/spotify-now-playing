export default interface Song {
    userUrl: string;
    name: string;
    url?: string;
    author: string;
    album: string;
    albumImageUrl: string;
    durationMs: number;
    listening: boolean;
};