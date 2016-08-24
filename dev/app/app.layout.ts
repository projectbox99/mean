"use strict";

import { Router } from "@angular/router";
import { Component,  OnInit} from "@angular/core";

// animation-specific imports
import { Input, trigger, state, style, transition, animate } from "@angular/core";

import { User, UserService } from "./Services/users.service";
import { AuthService } from "./Services/authentication.service";


@Component ({
    selector: "mean2-app",
    templateUrl: "app.layout.html",
    styleUrls: [ "app.layout.css" ],
    animations: [
        trigger("navLinkState", [
            state("inactive", style({
                transform: "scale(1)"
            })),
            state("active", style({
                transform: "scale(1.1)"
            })),
            transition("inactive => active", animate("100ms ease-in")),
            transition("active => inactive", animate("100ms ease-out"))
        ])
    ],
    providers: [ UserService, AuthService ]
})
export class AppLayout implements OnInit {
    public currentUser: User;
    public loggedIn: boolean;
    public currenUserRole: string;

    public loading: boolean;
    public active: boolean;
    public submitted: boolean;
    public error: string;

    constructor(private router: Router,
                private userService: UserService,
                private authService: AuthService) { }

    public linkState: string = "inactive";
    public toggleLinkState() {
        if (this.linkState === "active")
            this.linkState = "inactive";
        else
            this.linkState = "active";
    }

     public login(): void {
        this.loading = true;
        this.submitted = true;

        this.authService.login(this.currentUser.username, this.currentUser.password)
            .subscribe(result => {
                if (result === true) {
                    // login successful
                    this.currentUser = this.authService.currentUser;
                    this.currenUserRole = this.currentUser.role;
                    this.loggedIn = true;
                    this.setErrorMsg();
                    this.router.navigate(["/"]);
                } else {
                    // login failed
                    this.currentUser.password = "";
                    this.loading = false;
                    this.loggedIn = false;
                    this.submitted = false;
                    this.setErrorMsg("Invalid Username or Password");
                }

                this.loading = false;
            },
            error => {
                console.log(error);
                this.currentUser.password = "";
                this.loading = false;
                this.loggedIn = false;
                this.submitted = false;
                if (error.indexOf("401") > -1)
                    this.setErrorMsg("Invalid Username or Password");
                else
                    this.setErrorMsg(error);
            });
    }    // login()

    public logout(): void {
        this.authService.logout();

        this.active = false;
        setTimeout(() => this.active = true, 0);

        this.currentUser = this.authService.currentUser;
        this.currenUserRole = "";
        this.loggedIn = false;

        this.router.navigate(["/"]);
        this.loading = false;
    }    // logout() 

    // private helpers
    private setErrorMsg(errMsg?: string): void {
        if (errMsg) {
            this.error = errMsg.trim();
            setTimeout(() => this.error = "", 5000 /* ms */);
        }

        else this.error = "";
    }    // setErrorMsg()

    private gotoRegistration(): void {
        this.router.navigate(["/register"]);
    }    // gotoRegistration()

    ngOnInit() {
        this.authService.logout();
        this.currentUser = this.authService.currentUser;
        this.currenUserRole = "";
        this.loggedIn = false;

        this.loading = false;
        this.active = true;
        this.setErrorMsg();
    }    // ngOnInit()
}	// class AppLayout