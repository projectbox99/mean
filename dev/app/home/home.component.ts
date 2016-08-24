"use strict";

import { Router } from "@angular/router";
import { Component, OnInit, Input } from "@angular/core";

import { Subscription } from "rxjs/Subscription";

// services
import { User, UserService } from "../Services/users.service";
import { AuthService } from "../Services/authentication.service";
import { StandingData, Lists } from "../Services/standing.data.service";


@Component ({
    // selector: "user-list",
    templateUrl: "home.component.html",
    styleUrls: [ "home.component.css" ],
    providers: [ UserService, AuthService, StandingData ]
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

    constructor(private router: Router,
                private userService: UserService,
                private authService: AuthService,
                private standingData: StandingData) {
        this.setErrorMsg("");
        this.lists = new Lists([], [], []);
        this.loadStandingData();
    }    // constructor()

    public loadStandingData(): void {
        this.lists = this.standingData.getLists();
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

    ngOnInit() {
        this.loading = false;
        this.active = true;
    }    // ngOnInit()
}	// class HomeComponent