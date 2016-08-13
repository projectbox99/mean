"use strict";

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

import { AdsService, Ad } from "./ads.service";

@Component ({
    templateUrl: "./ad-detail.component.html"
})

export class AdDetailComponent implements OnInit, OnDestroy {
    ad: Ad;
    private sub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: AdsService) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let id = +params["id"]; // (+) converts string 'id' to a number
            this.service.getAd(id).then(ad => this.ad = ad);
            console.log("In OnInit - ad-detail.component.ts");
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    gotoAds() {
        // this.router.navigate(["/ads"]);
        let adId = this.ad ? this.ad.id : null;
        this.router.navigate(["/ads", { id: adId }]);
    }
}
console.log("In ad-detail.component.ts");