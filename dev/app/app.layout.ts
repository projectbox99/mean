"use strict";

import { Router } from "@angular/router";
import { Component,  OnInit} from "@angular/core";
import { NgForm } from "@angular/common";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

// animation-specific imports
import { Input, trigger, state, style, transition, animate } from "@angular/core";

import { User, UserService } from "./Services/users.service";
import { AuthService } from "./Services/authentication.service";
import { Lists, StandingData } from "./Services/standing.data.service";


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
                transform: "scale(1)"
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
    public currentUserRole: string;

    private lists: Lists;
    public pickedCategory;
    public editedCategory;

    public loading: boolean;
    public active: boolean;
    public submitted: boolean;
    public error: string;

    constructor(private router: Router,
                private userService: UserService,
                private authService: AuthService,
                private standingData: StandingData) {
        this.lists = new Lists([], [], []);
    }

    public linkState: string = "inactive";
    public toggleLinkState() {
        if (this.linkState === "active")
            this.linkState = "inactive";
        else
            this.linkState = "active";
    }

    public loadStandingData(): void {
        this.lists = this.standingData.getLists();
    }    // loadStandingData()

    public login(): void {
        this.loading = true;
        this.submitted = true;

        this.authService.login(this.currentUser.username, this.currentUser.password)
            .subscribe(result => {
                if (result === true) {
                    // login successful
                    this.loadStandingData();
                    this.currentUser = this.authService.currentUser;
                    this.currentUserRole = this.currentUser.role;
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
        this.currentUserRole = "";
        this.loggedIn = false;

        this.router.navigate(["/"]);
        this.loading = false;
    }    // logout() 

    private editCategory(): void {
        let picked: string = this.pickedCategory || "";
        let edited: string = this.editedCategory || "";
        let result;

        if (!edited)
            return;

        console.log(`picked: "${picked}"`);

        if (!picked || picked === undefined || picked === "") {        // add a new category entry
            console.info(`Requesting ADD on category: ${edited}`);
            result = this.standingData.addCategory(edited).subscribe(
                res => {
                    if (res.categories && res.categories.length) {
                        this.lists = res;
                        console.log(`this.lists set to: ${JSON.stringify(this.lists)}`);
                    } else {
                        this.setErrorMsg(`Could not add category: ${JSON.stringify(res)}`);
                        console.log(this.error);
                        return;
                    }
                },
                error => {
                    this.setErrorMsg(`Error adding category: ${edited}`);
                    console.log(this.error);
                    return;
                }
            );
        } else {                    // moodify an existing category entry
            console.info(`Requesting MODIFY on category: ${picked} -> ${edited}`);
            result = this.standingData.modifyCategory(picked, edited).subscribe(
                res => {
                    if (res.categories && res.categories.length) {
                        this.lists = res;
                        console.log(`this.lists set to: ${JSON.stringify(this.lists)}`);
                    } else {
                        this.setErrorMsg(`Could not change category: ${picked} to ${edited}`);
                        console.log(this.error);
                        return;
                    }
                },
                error => {
                    this.setErrorMsg(`Error changing category: ${picked} to ${edited}`);
                    console.log(this.error);
                    return;
                }
            );
        }

        if (!result) {
            this.setErrorMsg("Error updating category!");
            return;
        }

        this.pickedCategory = "";
        this.editedCategory = "";
    }    // editCategory()

    private removeCategory(): void {
        let picked: string = this.pickedCategory;
        let edited: string = this.editedCategory;

        if (!picked || edited)
            return;

        console.info(`Requesting REMOVE on category: ${picked}`);
        this.standingData.removeCategory(picked).subscribe(
            res => {
                if (res.categories && res.categories.length) {
                    this.lists = res;
                    console.log(`this.lists set to: ${JSON.stringify(this.lists)}`);
                } else {
                    this.setErrorMsg(`Could not remove category: ${JSON.stringify(res)}`);
                    console.log(this.error);
                    return;
                }
            },
            error => {
                this.setErrorMsg(`Error removing category: ${edited}`);
                console.log(this.error);
                return;
            }
        );

        this.pickedCategory = "";
        this.editedCategory = "";
    }    // removeCategory()

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

    private gotoProfile(): void {
        if (this.currentUser && this.currentUser.id.length) {
            this.router.navigate([ "/users", this.currentUser.id ]).then(
                result => {
                    if (result) {        // result === true
                        console.info("Redirect to user profile succeeded!");
                    } else {             // result === false
                        console.error("Redirect to user profile failed!");
                    }
                }, error => {
                    console.error(`Error redirecting to user's profile: ${error.toString()}`);
                }
            );
        }
    }    // gotoProfile()

    ngOnInit() {
        this.authService.logout();
        this.currentUser = this.authService.currentUser;
        this.currentUserRole = "";
        this.loggedIn = false;

        this.loading = false;
        this.active = true;
        this.setErrorMsg();
    }    // ngOnInit()
}	// class AppLayout