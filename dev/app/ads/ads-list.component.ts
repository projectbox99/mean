"use strict";

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { Subscription } from "rxjs/Subscription";

import { Ad, AdsService } from "../Services/ads.service";
import { AuthService } from "../Services/authentication.service";


@Component ({
    selector: "ads-list",
    templateUrl: "ads-list.component.html",
    styleUrls: [ "ads-list.component.css" ],
    providers: [ AdsService ]
})
export class AdsComponent {
    private ads: Ad[];
    private sub: Subscription;

    private loading: boolean;

    private usrRole: string;

    constructor(private router: Router,
                private adsService: AdsService,
                private authService: AuthService) {
        this.loadMyAds();
    }

    public loadAds(): void {
        this.sub = this.adsService.getAds()
            .subscribe(
                ads => {
                    this.ads = ads;
                },
                error => {
                    console.log(`Error: ${JSON.stringify(error)}`);
                },
                () => {
                    console.info("The ads Observable came through successfully!");
                }
            );
    }    // loadAds()

    public loadMyAds(): void {
        this.sub = this.adsService.getMyAds(this.authService.currentUser.id)
            .subscribe(
                ads => {
                    this.ads = ads;
                },
                error => {
                    console.log(`Error: ${JSON.stringify(error)}`);
                },
                () => {
                    console.info("The ads Observable came through successfully!");
                }
            );
    }    // loadMyAds()

    public refresh(): void {
        this.loading = true;
        this.loadAds();
        this.loading = false;
    }    // refresh()

    public delAd(id: string): void {
        console.info(`delAd(${id}) started`);
        this.loading = true;

        if (id) {
            this.adsService.deleteAd(id).subscribe(
                result => {
                    if (result === true) {
                        console.info(`delAd(${id}) returned SUCCESS!`);
                        this.loadAds();
                    } else {
                        console.error(`delAd(${id}) returned ${result}`);
                    }
                },
                error => {
                    console.log(`delAd(${id}) returned an Error: ${error.toString()}`);
                },
                () => {
                    console.info("delAd() Observable completed gracefully.");
                    this.loading = false;
                });
        }
    }    // delUser()

    public editAd(id: string): void {
        console.info(`editAd(${id}) started`);
        this.loading = true;

        if (id) {
            this.router.navigate([ "/ads", id ]).then(
                result => {
                    if (result) {        // result === true
                        console.info("Redirect to ad document succeeded!");
                    } else {             // result === false
                        console.error("Redirect to ad document failed!");
                    }
                }, error => {
                    console.error(`Error redirecting to ad document: ${error.toString()}`);
                }
            );
        }

        this.loading = false;
    }    // editUser()

    ngOnInit() {
        this.loading = false;
        this.usrRole = this.authService.currentUser.role;
    }

    ngOnDestroy() {
        if (this.sub)
            this.sub.unsubscribe();
    }
}    // class UsersComponent