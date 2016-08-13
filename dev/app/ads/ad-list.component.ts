"use strict";

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Ad, AdsService } from "./ads.service";

@Component ({
    templateUrl: "./ad-list.component.html"
})

export class AdListComponent {
    ads: Ad[];

    constructor(private router: Router, private service: AdsService) { }

    ngOnInit() {
        this.service.getAds().then(ads => this.ads = ads);
    }

    onSelect(ad: Ad) {
        this.router.navigate(["/ads", ad.id]);
    }
}