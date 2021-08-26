import { Fetch } from "./core/fetch";
import { Utils } from "./core/utils";

(async() => {
    const accessToken = await Fetch.getAccessToken();
    console.log(await Fetch.getCurrentlyPlaying(accessToken, Fetch.getAccessToken))
    const recentlyPlayed = await Fetch.getRecentlyPlayed(accessToken, Fetch.getAccessToken);
    console.log(await Utils.getLastRecentlyPlayed(recentlyPlayed));
})();