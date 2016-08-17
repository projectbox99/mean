"use strict";

import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { User, UserService } from "./register/register.service";

@Component ({
    selector: "mean2-app",
    templateUrl: "./app.layout.html",
    styleUrls: [ "./register/register.component.css" ],
    providers: [ UserService ]
})
export class AppLayout {
    constructor(private router: Router, private service: UserService) { }

    private user: User = null;
    private role: string = null;

    public get isLoggedIn(): boolean {
    	return this.user ? true : false;
    }
}	// class AppLayout