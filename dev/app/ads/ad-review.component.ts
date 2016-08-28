"use strict";

import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Response } from "@angular/http";
import { Location } from "@angular/common";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { User } from "../Services/users.service";
import { AdsService, Ad } from "../Services/ads.service";
import { StandingData, Lists } from "../Services/standing.data.service";
import { AuthService } from "../Services/authentication.service";


@Component ({
    templateUrl: "ad-review.component.html",
    styleUrls: [ "ad-review.component.css" ],
    providers: [ AdsService ]
})
export class AdReviewComponent implements OnInit, OnDestroy {
    private ad: Ad;
    private adOwner: User;

    private currentUser: User;
    private usrRole: string;

    private lists: Lists;
    private sub: Subscription;

    private errorMsg: string;

    // Image data
    private photoMain: string;
    private photos: string[];
    private percent: number;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private adsService: AdsService,
                private standingData: StandingData,
                private authService: AuthService,
                private element: ElementRef,
                private location: Location) {
        this.errorMsg = "";

        this.currentUser = authService.currentUser;
        this.usrRole = authService.usrRole;

        this.loadStandingData();

        this.photoMain = "";
        this.photos = <string[]>[];
    }

    public loadStandingData(): void {
        this.lists = this.standingData.getLists();
    }    // loadStandingData()

    gotoAds() {
        this.router.navigate(["/ads"]);
    }   // gotoAds()

    ngOnInit() {
        this.ad = new Ad();

        this.sub = this.route.params.subscribe(
            params => {
                let id = params["id"];
                if (id) {
                    this.adsService.getAd(id).subscribe(
                        adData => {
                            this.ad = adData;
                            this.photoMain = "/uploads/" + this.ad.photoMain;
                            for (let i = 0; i < this.ad.photos.length; i++) {
                            	this.photos[i] = "/uploads/" + this.ad.photos[i];
                            }


                        }, error => this.errorMsg = <any>error
                    );
                }
            }
        );
    }    // ngOnInit()

    ngOnDestroy() {
        if (this.sub)
            this.sub.unsubscribe();
    }    // ngOnDestroy()

    private handleError (error: any) {
        this.errorMsg = (error.message)
            ? error.message
            : error.status
                ? `${error.status} - ${error.statusText}`
                : "Server error";

        console.error(this.errorMsg);
        return Observable.throw(this.errorMsg);
    }    // handleError()
}