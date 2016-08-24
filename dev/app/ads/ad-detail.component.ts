"use strict";

import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { AdsService, Ad } from "../Services/ads.service";
import { StandingData, Lists } from "../Services/standing.data.service";
import { AuthService } from "../Services/authentication.service";


@Component ({
    templateUrl: "ad-detail.component.html",
    styleUrls: [ "ad-detail.component.css" ],
    providers: [ AdsService, AuthService, StandingData ]
})
export class AdDetailComponent implements OnInit, OnDestroy {
    @Input() ad: Ad;
    @Output() close = new EventEmitter();

    private curUsrRole: string;

    private selectedId: string;

    private lists: Lists;
    private sub: Subscription;

    private active: boolean;
    private loading: boolean;
    private isEditingAd: boolean;
    private errorMsg: string;
    private statusMsg: string;

    private isEditingUser: boolean;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private adsService: AdsService,
                private standingData: StandingData,
                private authService: AuthService,
                private element: ElementRef,
                private location: Location) {
        this.curUsrRole = authService.usrRole;
        this.loadStandingData();
    }

    public get diagnostic(): string { return JSON.stringify(this.ad); }

    public loadStandingData(): void {
        this.lists = this.standingData.getLists();
    }    // loadStandingData()

    public imgChange(event) {
        let target = EventTarget;
        let image = this.element.nativeElement.querySelector('.ad-image-input');
        let reader: any = new FileReader();

        var self = this;

        // reader.onload = function(e) {
        //     self.ad.photo = e.target.result;
        //     image.src = self.ad.photo;
        // }

        reader.readAsDataURL(event.target.files[0]);
    }    // imgChange()

    public onSubmit(): void {
        this.errorMsg = "";
        this.statusMsg = "";

        if (this.isEditingUser) {
            this.modifyAd(this.ad);
        } else {
            this.addAd(this.ad);
        }

        if (this.errorMsg) {
            this.active = true;
        } else {
            if (this.isEditingAd)
                setTimeout(() => this.location.back(), 1000);
            else
                setTimeout(() => this.router.navigate([ "/" ]), 1000);
        }
    }    // onSubmit()

    public clearForm(): void {
        // features a temporary workaround while we await a proper form reset feature
        this.ad = new Ad();
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }    // clearForm()

    private addAd(ad: Ad): void {
        this.adsService.postAd(this.ad)
            .subscribe(            // we want an Observable returned
                adData => {      // function to invoke for each element in the observable sequence
                    this.ad = adData;
                    this.statusMsg = "User created successfully";
                    this.active = false;
                },
                error => {         // function to invoke on exceptional termination of the obs. sequence
                    this.errorMsg = <any>error;
                },
                () => {
                    // function to invoke upon graceful termination of the observable sequence
                    console.info("UserRegistrationComponent.addUser()'s observable completed gracefully");
                });
    }    // addAd()

    private modifyAd(ad: Ad): void {
        this.adsService.putAd(this.ad)
            .subscribe(
                adData => {
                    this.ad = adData;
                    this.statusMsg = "User modified successfully";
                    this.active = true;
                },
                error => {
                    this.errorMsg = <any>error;
                },
                () =>{
                    console.info("UserRegistrationComponent.modifyUser()'s observable completed gracefully");
                });
    }    // modifyAd()

    saveAd() {
        if (this.ad.id) {
            this.adsService.putAd(this.ad).subscribe(
                ad => this.ad = ad,
                error => this.handleError(error));
        } else {
            this.adsService.postAd(this.ad).subscribe(
                ad => this.ad = ad,
                error => this.handleError(error));
        }
    }	// saveAd()

    deleteAd(id: string, event: any): void {
        event.stopPropagation();
        this.loading = true;

        if (id) {
            this.adsService.deleteAd(id).subscribe(
                result => {
                    if (result === true) {
                        this.selectedId = null;
                        this.gotoAds();
                    }
                },
                error => this.handleError(error),
                () => {
                    this.loading = false;
                });
        }
    }	// deleteAd()

    gotoAds() {
        this.router.navigate(["/ads"]);
        // let adId = this.ad ? this.ad.id : null;
        // this.router.navigate(["/ads", { id: adId }]);
    }   // gotoAds()

    ngOnInit() {
        this.ad = new Ad();
        this.isEditingAd = false;

        this.sub = this.route.params.subscribe(
            params => {
                let id = params["id"];
                if (id && id !== "create") {
                    this.isEditingAd = true;
                    this.adsService.getAd(id).subscribe(
                        adData => {
                            this.ad = adData;
                            console.info(`Setting register.component.user to ${JSON.stringify(this.ad)}`);
                        }, error => this.errorMsg = <any>error
                    );
                }    // if
            }
        );

        this.errorMsg = "";
        this.statusMsg = "";
        this.active = true;
        this.loading = false;
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