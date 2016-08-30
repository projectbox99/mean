"use strict";

import { Router } from "@angular/router";
import { Component, OnInit, Input } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

// services
import { User, UserService } from "../Services/users.service";
import { Ad, AdsService } from "../Services/ads.service";
import { AuthService } from "../Services/authentication.service";
import { StandingData, Lists } from "../Services/standing.data.service";
import { PagerService } from "../Services/pager.service";


@Component ({
    // selector: "user-list",
    templateUrl: "home.component.html",
    styleUrls: [ "home.component.css" ],
    providers: [ AdsService ]
})
export class HomeComponent implements OnInit {
    private lists: Lists;

    private ads: Ad[];
    private adsCount: number;

    private loading: boolean;
    private active: boolean;
    private error: string;

    private startIdx: number;
    private count: number;
    private dummyItems: number[];
    private pager: any = {};
    private pagedItems: any[];

    constructor(private router: Router,
                private userService: UserService,
                private adsService: AdsService,
                private authService: AuthService,
                private standingData: StandingData,
                private pagerService: PagerService) {
        this.setErrorMsg("");
        this.lists = new Lists([], [], []);
        this.ads = <Ad[]>[];
        this.adsCount = this.ads.length;
        this.loadStandingData();

        this.startIdx = 0;
        this.count = 10;
        this.dummyItems = <number[]>[];
        for (let i = 1; i < 151; i++)
            this.dummyItems.push(i);

        this.getHomeAds();
    }    // constructor()

    public loadStandingData(): void {
        this.lists = this.standingData.getLists()
    }    // loadStandingData()

    public getHomeAds(startIdx: number = this.startIdx, count: number = this.count): void {
        this.adsService.getAds(startIdx, count).subscribe(
            res => {
                this.ads = res;
                this.adsCount = this.ads.length;
                console.log(`this.ads: ${this.ads.length}`);
                this.setPage(1);
            },
            error => {
                this.setErrorMsg("Could not retrieve ads!");
                console.error(this.error);
            }
        )
    }    // getHomeAds()

    // private helpers
    private setErrorMsg(errMsg?: string): void {
        let msg = errMsg.trim();

        if (msg) {
            this.error = msg;
            setTimeout(() => this.error = "", 5000 /* ms */);
        }

        else this.error = "";
    }    // setErrorMsg()

    private setPage(page: number): void {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        this.pager = this.pagerService.getPager(this.adsCount || 10, page);
        this.pagedItems = this.ads.slice(this.pager.startIndex, this.pager.endIndex + 1);
        console.info(`${this.adsCount}`);
        // this.pager = this.pagerService.getPager(this.dummyItems.length, page);
        // this.pagedItems = this.dummyItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }    // setPage()

    ngOnInit() {
        this.loading = false;
        this.active = true;

        this.setPage(1);
    }    // ngOnInit()
}	// class HomeComponent