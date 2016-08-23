"use strict";

import { Component, OnInit, OnDestroy } from "@angular/core";

import { User, UserService } from "../Services/users.service";
import { Subscription } from "rxjs/Subscription";


@Component ({
    selector: "user-list",
    template: `
        <tr *ngFor="let user of users">
            <td>user.username</td>
            <td></td>
        </tr>
    `,
    styleUrls: [ "users.component.css" ]
})
export class UsersListComponent {
    private users: User[];
    private sub: Subscription;

    constructor(private userService: UserService) {
        console.log("In UsersListComponent.constructor()...");
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
    }

    // ngOnInit() {
    //     this.sub = this.userService.getUsers()
    //         .subscribe(
    //             users => {
    //                 this.users = users;
    //             },
    //             error => {
    //                 console.log(`Error: ${JSON.stringify(error)}`);
    //             },
    //             () => {
    //                 console.info("The Observable came through successfully!");
    //             }
    //         );
    // }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}	// class UsersComponent