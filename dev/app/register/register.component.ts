"use strict";

import { Component, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { NgForm, Location } from "@angular/common";

import { Subscription } from "rxjs/Subscription";

import { User, UserService } from "../Services/users.service";


@Component ({
    templateUrl: "register.component.html",
    styleUrls: [ "register.component.css" ],
    providers: [ UserService ]
})
export class UserRegistrationComponent implements OnInit, OnDestroy {
    public constructor(private userService: UserService,
                       private location: Location,
                       private element: ElementRef) { }

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

    public imgChange(event) {
    	let reader: any = new FileReader();
    	let target: EventTarget;
    	let image = this.element.nativeElement.querySelector(".user-image");

    	reader.onload = function(e) {
    		let src = e.target.result;
    		image.src = src;
    	}

    	reader.readAsDataURL(event.target.files[0]);
    }	// imgChange()

    public onSubmit(): void {
        this.submitted = true;
        this.errorMsg = "";
        this.statusMsg = "";

        this.addUser(this.user);

        if (this.errorMsg) {
            this.active = true;
            this.submitted = false;
        }
    }    // onSubmit()

    public clearForm(): void {
        // features a temporary workaround while we await a proper form reset feature
        this.user = new User("" /* id */, "" /* username */, "" /* password */);
        this.password2 = "";
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }    // clearForm()

    private addUser(user: User): void {
        this.userService.addUser(this.user)
            .subscribe(            // we want an Observable returned
                userData => {      // function to invoke for each element in the observable sequence
                    this.user = userData;
                    this.password2 = "";
                    this.isAdmin = this.user.role === "admin";
                    this.statusMsg = "User created successfully";
                    this.submitted = true;
                    this.active = false;

                    setTimeout(() => this.location.back(), 5000);
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