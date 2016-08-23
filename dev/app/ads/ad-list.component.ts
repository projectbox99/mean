"use strict";

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { Subscription } from "rxjs/Subscription";

import { Ad, AdsService } from "../Services/ads.service";


@Component ({
    templateUrl: "./ad-list.component.html",
    providers: [ AdsService ]
})
export class AdListComponent implements OnInit, OnDestroy {
    private ads: Ad[];

    private selectedAd: Ad;
    private sub: Subscription;
    private errorMessage: any;

    constructor(private service: AdsService, private route: ActivatedRoute, private router: Router) { }

    getAds() {
        this.sub = this.service.getAds()
            .subscribe(
                ads => this.ads = ads,
                error => this.errorMessage = <any>error);
    }    // getAds()

    newAd() {
        this.selectedAd = null;
    }    // newAd()

    onSelect(ad: Ad) {
        this.selectedAd = ad;
        this.router.navigate(["/ads", ad.id]);
    }    // onSelect()

    ngOnInit() {
        this.selectedAd = null;
        this.getAds();
    }    // ngOnInit()

    ngOnDestroy() {
        this.sub.unsubscribe();
    }    // ngOnDestroy()
}    // class AdListComponent