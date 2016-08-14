"use strict";

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Ad, AdsService } from "./ads.service";
import { Subscription } from "rxjs/Subscription";

console.log("Entering ad-list component!")

@Component ({
    templateUrl: "./ad-list.component.html",
    providers: [AdsService]
})
export class AdListComponent implements OnInit, OnDestroy {
    ads: Ad[];

    private sub: Subscription;
    private errorMessage: any;

    constructor(private service: AdsService, private route: ActivatedRoute, private router: Router) {
        console.log("ad-list.constructor!");
    }

    getAds() {
        console.info("getAds!");
        this.sub = this.service.getAds()
            .subscribe(
                ads => this.ads = ads,
                error => this.errorMessage = <any>error);
    }

    ngOnInit() {
        console.info("OnInit!");
        this.getAds();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onSelect(ad: Ad) {
        console.info("OnSelect!");
        this.router.navigate(["/ads", ad.id]);
    }
}