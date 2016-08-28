"use strict";

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { Subscription } from "rxjs/Subscription";

import { User } from "../Services/users.service";
import { Ad, AdsService } from "../Services/ads.service";
import { AuthService } from "../Services/authentication.service";


@Component ({
    selector: "ads-list",
    templateUrl: "ads-list.component.html",
    styleUrls: [ "ads-list.component.css" ],
    providers: [ AdsService ]
})
export class AdsComponent {
    private currentUser: User;
    private usrRole: string;


    private ads: Ad[];
    private sub: Subscription;

    private loading: boolean;
    private currentList: string;

    constructor(private router: Router,
                private adsService: AdsService,
                private authService: AuthService) {
        this.currentUser = this.authService.currentUser;
        this.usrRole = this.currentUser.role;
    }

    public loadAds(myList: string): void {
        if (myList === "regular" || myList === "supervisor") {
            let list_target: string = myList === "regular" ? this.currentUser.id : "__unapproved__";
            this.sub = this.adsService.getMyAds(list_target).subscribe(
                ads => {
                    this.ads = ads;
                },
                error => {
                    console.log(`Error: ${JSON.stringify(error)}`);
                }
            );
        } else if (myList === "admin") {
            this.sub = this.adsService.getAds().subscribe(
                ads => {
                    this.ads = ads;
                },
                error => {
                    console.log(`Error: ${JSON.stringify(error)}`);
                }
            );
        }
    }    // loadAds()

    public refresh(myList: string = ""): void {
        this.loading = true;
        if (myList) {
            this.loadAds(myList);
        } else {
            this.loadAds("regular");
        }

        this.loading = false;
    }    // refresh()

    public delAd(id: string): void {
        this.loading = true;

        if (id) {
            this.adsService.deleteAd(id).subscribe(
                result => {
                    if (result === true) {
                        console.info(`delAd(${id}) returned SUCCESS!`);
                        this.refresh(this.currentList);
                    } else {
                        console.error(`delAd(${id}) returned ${result}`);
                    }
                },
                error => {
                    console.log(`delAd(${id}) returned an Error: ${error.toString()}`);
                },
                () => this.loading = false
            );
        }
    }    // delUser()

    public editAd(id: string): void {
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

    public previewAd(id: string): void {
        if (id) {
            this.router.navigate([ "/ads/preview", id ]);
        }
    }    // previewAd()

    ngOnInit() {
        this.loading = true;
        this.refresh(this.usrRole);
        this.loading = false;
    }

    ngOnDestroy() {
        if (this.sub)
            this.sub.unsubscribe();
    }
}    // class UsersComponent