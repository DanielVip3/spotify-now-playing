import { Fetch } from "./core/fetch";
import { Utils } from "./core/utils";

/*
* This file is only for temporary manual testing. It will, in the future, export, configure and set everything up, and automatic test suites will be implemented.
*/
(async() => {
    const accessToken = await Fetch.getAccessToken();
    console.log(await Fetch.getCurrentlyPlaying(accessToken, Fetch.getAccessToken))
    const recentlyPlayed = await Fetch.getRecentlyPlayed(accessToken, Fetch.getAccessToken);
    console.log(await Utils.getLastRecentlyPlayed(recentlyPlayed));
})();