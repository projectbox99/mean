"use strict";

import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm, Location } from "@angular/common";

import { Subscription } from "rxjs/Subscription";

import { User, UserService } from "./register.service";

@Component ({
    templateUrl: "register.component.html",
    styleUrls: [ "register.component.css" ],
    providers: [ UserService ]
})
export class UserRegistrationComponent implements OnInit, OnDestroy {
    public constructor(private service: UserService, private location: Location) { }

    private user: User;
    private password2: string;
    private roles: string[];
    private isAdmin: boolean;

    private sub: Subscription;

    private errorMsg: string;
    private statusMsg: string;
    private submitted: boolean;
    private active: boolean;

    // make sure two-way binding is working
    public get diagnostic(): string { return JSON.stringify(this.user); }

    public onSubmit(): void {
        this.submitted = true;
        this.errorMsg = "";
        this.statusMsg = "";

        this.addUser(this.user);

        if (this.errorMsg) {
            this.active = true;
            this.submitted = false;
        }

        this.location.back();
    }    // onSubmit()

    public clearForm(): void {
        // features a temporary workaround while we await a proper form reset feature
        this.user = new User("" /* id */, "" /* username */, "" /* password */);
        this.password2 = "";
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }    // clearForm()

    private addUser(user: User): void {
        this.service.addUser(this.user)
            .subscribe(            // we want an Observable returned
                userData => {      // function to invoke for each element in the observable sequence
                    this.user = userData;
                },
                error => {         // function to invoke on exceptional termination of the obs. sequence
                    this.errorMsg = <any>error;
                },
                () => {
                    // function to invoke upon graceful termination of the observable sequence
                    console.info("UserRegistrationComponent.addUser()'s observable completed gracefully");
                });
    }    // addUser()

    ngOnInit() {
        this.user = new User("" /* id */, "" /* username */, "" /* password */);
        this.password2 = "";
        this.roles = [ "admin", "supervisor", "regular" ];
        this.isAdmin = true;

        this.errorMsg = "";
        this.statusMsg = "";
        this.submitted = false;
        this.active = true;
    }    // ngOnInit()

    ngOnDestroy() {
        if (this.sub)
            this.sub.unsubscribe();
    }    // ngOnDestroy()
}    // class UserRegistrationComponent