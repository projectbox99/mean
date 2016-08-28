"use strict";

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { User, UserService } from "../Services/users.service";
import { Subscription } from "rxjs/Subscription";


@Component ({
    selector: "user-list",
    templateUrl: "./users.component.html",
    styleUrls: [ "users.component.css" ],
    providers: [ UserService ]
})
export class UsersComponent {
    private users: User[];
    private sub: Subscription;

    private loading: boolean;

    constructor(private userService: UserService,
                private router: Router) {
        this.loadUsers();
    }

    public loadUsers(): void {
        this.sub = this.userService.getUsers()
            .subscribe(
                users => {
                    this.users = users;
                },
                error => {
                    console.log(`Error: ${JSON.stringify(error)}`);
                },
                () => {
                    console.info("The users Observable came through successfully!");
                }
            );
    }    // loadUsers()

    public refresh(): void {
        this.loading = true;
        this.loadUsers();
        this.loading = false;
    }    // refresh()

    public delUser(id: string): void {
        console.info(`delUser(${id}) started`);
        this.loading = true;

        if (id) {
            this.userService.deleteUser(id).subscribe(
                result => {
                    if (result === true) {
                        console.info(`delUser(${id}) returned SUCCESS!`);
                        this.loadUsers();
                    } else {
                        console.error(`delUser(${id}) returned ${result}`);
                    }
                },
                error => {
                    console.log(`delUser(${id}) returned an Error: ${error.toString()}`);
                },
                () => {
                    console.info("delUser() Observable completed gracefully.");
                    this.loading = false;
                });
        }
    }    // delUser()

    public editUser(id: string): void {
        console.info(`editUser(${id}) started`);
        this.loading = true;

        if (id) {
            this.router.navigate([ "/users", id ]).then(
                result => {
                    if (result === true) {
                        console.info("Redirect to user profile succeeded!");
                    } else {             // result === false
                        console.error("Redirect to user profile failed!");
                    }
                }, error => {
                    console.error(`Error redirecting to user's profile: ${error.toString()}`);
                }
            );
        }

        this.loading = false;
    }    // editUser()

    ngOnInit() {
        this.loading = false;
    }

    ngOnDestroy() {
    	if (this.sub)
        	this.sub.unsubscribe();
    }
}    // class UsersComponent