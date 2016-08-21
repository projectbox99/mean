"use strict";

import { Component, OnInit, OnDestroy } from "@angular/core";

import { User, UserService } from "../Services/users.service";
import { Subscription } from "rxjs/Subscription";


@Component ({
    templateUrl: "users.component.html",
    styleUrls: [ "users.component.css" ]
})
export class UsersComponent {
    public users: User[];

    private sub: Subscription;

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.sub = this.userService.getUsers()
            .subscribe(
                users => {
                    this.users = users;
                    console.info(users);
                },
                error => {
                    console.log(`Error: ${JSON.stringify(error)}`);
                },
                () => {
                    console.info("The Observable came through successfully!");
                }
            );
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}	// class UsersComponent