"use strict";

import { Component,  OnInit} from "@angular/core";
import { Router } from "@angular/router";

import { User, UserService } from "./register/register.service";

import { AuthenticationService } from './authentication.service';

@Component ({
    selector: "mean2-app",
    templateUrl: "./app.layout.html",
    styleUrls: [ "./register/register.component.css" ],
    providers: [ UserService ]
})
export class AppLayout implements OnInit {

    model: any = {};
    loading = false;
    error = '';

    users: User[] = [];

    constructor(private router: Router, private service: UserService, private authenticationService: AuthenticationService) { }

    ngOnInit() {
        this.authenticationService.logout();
        // get users from secure api end point
        this.service.getUsers()
            .subscribe(users => {
                this.users = users;
            });
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {
                    // login successful
                    this.router.navigate(['/']);
                } else {
                    // login failed
                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
    }

    private user: User = new User("", "", "");
    private role: string = null;
    public active: boolean = true;

    public get isLoggedIn(): boolean {
        return this.user ? true : false;
    }
}	// class AppLayout