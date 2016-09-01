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
import { SearchService } from "../Services/search.service";


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

    private search: string;
    private isInSearchResults: boolean;
    private activeCategory: string;
    private activeCity: string;

    private searchAds: Ad[];
    private startIdx: number;
    private count: number;
    private pager: any = {};
    private pagedItems: any[];
    private currentPage: number;

    constructor(private router: Router,
                private userService: UserService,
                private adsService: AdsService,
                private authService: AuthService,
                private standingData: StandingData,
                private pagerService: PagerService,
                private searchService: SearchService) {
        this.setErrorMsg("");
        this.lists = new Lists([], [], []);
        this.ads = <Ad[]>[];
        this.adsCount = 0;
        this.loadStandingData();

        this.searchAds = <Ad[]>[];
        this.search = "";
        this.isInSearchResults = false;
        this.activeCategory = "";
        this.activeCity = "";

        this.startIdx = 0;
        this.count = 9;
        this.currentPage = 0;
        // this.pager = this.pagerService.getPager(this.adsCount || this.count, this.currentPage);

        // this.getHomeAds(this.startIdx, this.count);
    }    // constructor()

    public loadStandingData(): void {
        this.lists = this.standingData.getLists()
    }    // loadStandingData()

    public getHomeAds(startIdx: number = this.startIdx, count: number = this.count): void {
        this.adsService.getAds(startIdx, count).subscribe(
            res => {
                this.ads = res;
                this.adsCount = this.adsService.count;
                this.isInSearchResults = false;
                this.pager = this.pagerService.getPager(this.adsCount || this.count, this.currentPage);
                this.pagedItems = this.ads;
            },
            error => {
                this.setErrorMsg("Could not retrieve ads!");
                console.error(this.error);
            }
        )
    }    // getHomeAds()

    private previewAd(id: string): void {
        if (id) {
            this.router.navigate([ '/ads/preview', id ]);
        }
    }    // previewAd()

    private changeActiveCategory(cat: string): void {
        if (cat.trim()) {
            if (cat.trim() !== this.activeCategory) {
                this.activeCategory = cat.trim();
            } else {
                this.activeCategory = "";
            }
        }
    }    // changeActiveCategory()

    private changeActiveCity(city: string): void {
        if (city.trim()) {
            if (city.trim() !== this.activeCity) {
                this.activeCity = city.trim();
            } else {
                this.activeCity = "";
            }
        }
    }    // changeActiveCategory()

    private startSearch(): void {
        if (this.search.trim()) {
            console.log(`Entering startSearch()`);
            this.searchService.searchInAds(this.search.trim(), this.activeCategory, this.activeCity).subscribe(
                res => {
                    this.searchAds = res;
                    this.adsCount = this.searchService.count;
                    //this.ads = this.searchAds.slice(0, Math.min(this.count - 1, this.adsCount));
                    console.log(`this.searchAds: ${JSON.stringify(this.searchAds)}`);
                    console.log(`this.adsCount: ${this.adsCount}`);
                    this.pager = this.pagerService.getPager(this.adsCount, 1, this.count);
                    this.displaySeachResults(this.pager.startIndex, this.pager.endIndex);
                    this.isInSearchResults = true;
                },
                error => {
                    this.setErrorMsg("Could not execute search!");
                    console.error(this.error);
                }
            )
        }
    }    // startSearch()

    private displaySeachResults(start: number = this.pager.startIndex, end: number = this.pager.endIndex): void {
    	if (this.searchAds && this.adsCount) {
    		this.pagedItems = this.searchAds.slice(start, end + 1);
    	} else {
    		this.pagedItems = [];
    	}
    }	// displaySeachResults()

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

        this.pager = this.pagerService.getPager(this.adsCount || this.count, page);
        // this.pagedItems = this.ads.slice(this.pager.startIndex, this.pager.endIndex + 1);

        if (this.currentPage !== page) {
        	if (!this.isInSearchResults) {
	            this.getHomeAds(this.pager.startIndex, this.count);
	        } else {
	        	this.displaySeachResults(this.pager.startIndex, this.pager.endIndex);
	        }

            this.currentPage = page;
        }
        // this.pager = this.pagerService.getPager(this.dummyItems.length, page);
        // this.pagedItems = this.dummyItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }    // setPage()

    ngOnInit() {
        this.loading = false;
        this.active = true;

        this.setPage(1);
    }    // ngOnInit()
}	// class HomeComponent