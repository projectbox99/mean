"use strict";

import { Router } from "@angular/router";
import { Component, OnInit, Input } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

// services
import { User, UserService } from "../Services/users.service";
import { AuthService } from "../Services/authentication.service";
import { StandingData, Lists } from "../Services/standing.data.service";
import { PagerService } from "../Services/pager.service";


@Component ({
    // selector: "user-list",
    templateUrl: "home.component.html",
    styleUrls: [ "home.component.css" ]
    // providers: [ UserService, AuthService, StandingData ]
})
export class HomeComponent implements OnInit {
    private lists: Lists;

    public get categories(): string[] {
        return this.lists.categories || [];
    }

    public get cities(): string[] {
        return this.lists.cities || [];
    }

    public get roles(): string[] {
        return this.lists.categories || [];
    }

    private loading: boolean;
    private active: boolean;
    private error: string;

    private dummyItems: number[];
    private pager: any = {};
    private pagedItems: any[];

    constructor(private router: Router,
                private userService: UserService,
                private authService: AuthService,
                private standingData: StandingData,
                private pagerService: PagerService) {
        this.setErrorMsg("");
        this.lists = new Lists([], [], []);
        this.loadStandingData();

        this.dummyItems = <number[]>[];
        for (let i = 1; i < 151; i++)
            this.dummyItems.push(i);
    }    // constructor()

    public loadStandingData(): void {
        this.lists = this.standingData.getLists()
    }    // loadStandingData()


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

        this.pager = this.pagerService.getPager(this.dummyItems.length, page);
        this.pagedItems = this.dummyItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }    // setPage()

    ngOnInit() {
        this.loading = false;
        this.active = true;

        this.setPage(1);
    }    // ngOnInit()
}	// class HomeComponent