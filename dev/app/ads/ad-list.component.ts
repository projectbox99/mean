"use strict";

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Ad, AdsService } from "./ads.service";
import { Subscription } from "rxjs/Subscription";

@Component ({
    templateUrl: "./ad-list.component.html"
})

export class AdListComponent implements OnInit, OnDestroy {
    ads: Ad[];

    private selectedId: number;
    private sub: Subscription;

    constructor( private service: AdsService, private route: ActivatedRoute, private router: Router ) { }

    ngOnInit() {
        this.sub = this.route
            .params
            .subscribe(params => {
                this.selectedId = +params["id"];
                this.service.getAds()
                    .then(ads => this.ads = ads);
            });
        console.log("In OnInit - ad-list.component.ts");
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onSelect(ad: Ad) {
        this.router.navigate(["/ads", ad.id]);
    }
}
console.log("In ad-list.component.ts");