"use strict";

import { Injectable } from "@angular/core";

export class Ad {
    constructor(public id: number, public name: string) { }
}

let ADS = [
    new Ad(11, "Mr. Nice"),
    new Ad(12, "Narco"),
    new Ad(13, "Bombasto"),
    new Ad(14, "Celeritas"),
    new Ad(15, "Magneta"),
    new Ad(16, "RubberMan")
];

let adsPromise = Promise.resolve(ADS);

@Injectable()
export class AdsService {
    getAds() { return adsPromise; }

    getAd(id: number | string) {
        return adsPromise
            .then(ads => ads.find(ad => ad.id === +id));
    }
}