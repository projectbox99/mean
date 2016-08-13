"use strict";

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

import { AdsService, Ad } from "./ads.service";

@Component ({
    templateUrl: "./ad-detail.component.html"
})

export class AdDetailComponent implements OnInit, OnDestroy {
    ad: Ad;

    private selectedId: number;
    private sub: Subscription;
    private errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: AdsService) {}

    ngOnInit() {
        this.selectedId = +this.route.params["id"];                // (+) converts string 'id' to a number
        this.service.getAd(this.selectedId).subscribe(
            ad => this.ad = ad,
            error => this.errorMessage = <any>error);
    }    // ngOnInit()

    ngOnDestroy() {
        this.sub.unsubscribe();
    }    // ngOnDestroy()

    gotoAds() {
        // this.router.navigate(["/ads"]);
        let adId = this.ad ? this.ad.id : null;
        this.router.navigate(["/ads", { id: adId }]);
    }    // gotoAds()
}