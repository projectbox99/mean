"use strict";

import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { AdsService, Ad } from "./ads.service";

@Component ({
    templateUrl: "./ad-detail.component.html"
})

export class AdDetailComponent implements OnInit, OnDestroy {
    @Input() ad: Ad;
    @Output() close = new EventEmitter();

    private selectedId: number;
    private sub: Subscription;
    private errorMessage: string;

    private navigatedHere = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: AdsService) {}

    ngOnInit() {
        this.route.params.forEach( (params: Params) => {
            if (params["id"] !== undefined) {
                let id = +params["id"];
                this.navigatedHere = true;
                this.service.getAd(id).subscribe(
                    ad => this.ad = ad,
                    error => this.errorMessage = <any>error);
            } else {
                this.navigatedHere = false;
                this.ad = new Ad();
            }
        });
        // this.selectedId = +this.route.params["id"];                // (+) converts string 'id' to a number
        // this.service.getAd(this.selectedId).subscribe(
            // ad => this.ad = ad,
            // error => this.errorMessage = <any>error);
    }    // ngOnInit()

    ngOnDestroy() {
        this.sub.unsubscribe();
    }    // ngOnDestroy()

    saveAd() {
        if (this.ad.id) {
            this.service.putAd(this.ad).subscribe(
                ad => this.ad = ad,
                error => this.handleError(error));
        } else {
            this.service.postAd(this.ad).subscribe(
                ad => this.ad = ad,
                error => this.handleError(error));
        }
    }	// saveAd()

    deleteAd(ad: Ad, event: any) {
        event.stopPropagation();

        if (this.ad.id) {
            this.service.deleteAd(ad).subscribe(
                ad => {
                    if (this.selectedId === +ad.id) {
                        this.selectedId = null;
                    }
                },
                error => this.handleError(error));
        }
    }	// deleteAd()

    gotoAds() {
        // this.router.navigate(["/ads"]);
        let adId = this.ad ? this.ad.id : null;
        this.router.navigate(["/ads", { id: adId }]);
    }    // gotoAds()

    private handleError (error: any) {
        console.info("ad-detail.component.handleError!");
        this.errorMessage = (error.message)
            ? error.message
            : error.status
                ? `${error.status} - ${error.statusText}`
                : "Server error";

        console.error(this.errorMessage);
        return Observable.throw(this.errorMessage);
    }    // handleError()
}