"use strict";

import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

// services
import { User, UserService } from "../Services/users.service";
import { AuthService } from "../Services/authentication.service";
import { StandingData } from "../Services/standing.data.service";


@Component ({
    selector: "view",
    templateUrl: "home.component.html",
    styleUrls: [ "home.component.css" ],
    providers: [ UserService, AuthService, StandingData ]
})
export class HomeComponent implements OnInit {
    public loggedIn: boolean;
    public currentUser: User;

    public categories: string[];

    public loading: boolean;
    public active: boolean;
    public error: string;

    constructor(private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private standingData: StandingData) {
            this.categories = this.standingData.getCategories;
    }

    // private helpers
    private setErrorMsg(errMsg?: string): void {
        if (errMsg) {
            this.error = errMsg.trim();
            setTimeout(() => this.error = "", 5000 /* ms */);
        }

        else this.error = "";
    }    // setErrorMsg()

    ngOnInit() {
        this.currentUser = this.authService.currentUser;
        this.loggedIn = this.authService.usrLoggedIn;
        this.categories = this.standingData.getCategories;
        console.log(this.categories);

        this.loading = false;
        this.active = true;
        this.setErrorMsg();
    }    // ngOnInit()
}	// class HomeComponent