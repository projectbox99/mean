"use strict";

import { Component, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { NgForm, Location } from "@angular/common";
import { Router, ActivatedRoute, Params } from "@angular/router";


import { Subscription } from "rxjs/Subscription";

import { User, UserService } from "../Services/users.service";
import { StandingData } from "../Services/standing.data.service";
import { AuthService } from "../Services/authentication.service";


@Component ({
    templateUrl: "register.component.html",
    styleUrls: [ "register.component.css" ],
    providers: [ UserService ]
})
export class UserRegistrationComponent implements OnInit, OnDestroy {
    public constructor(private authService: AuthService,
                       private userService: UserService,
                       private standingData: StandingData,
                       private location: Location,
                       private element: ElementRef,
                       private route: ActivatedRoute,
                       private router: Router) { }

    private user: User;
    private password2: string;
    private roles: string[];

    private currentUser: User;
    private isAdmin: boolean;

    private sub: Subscription;

    private isEditingUser: boolean;
    private errorMsg: string;
    private statusMsg: string;
    private active: boolean;


    // make sure two-way binding is working
    public get diagnostic(): string { return JSON.stringify(this.user); }

    public imgChange(event) {
    	let target = EventTarget;
    	let image = this.element.nativeElement.querySelector('.user-image-input');
    	let reader: any = new FileReader();

    	var self = this;

    	reader.onload = function(e) {
    		self.user.photo = e.target.result;
    		image.src = self.user.photo;
    	}

    	reader.readAsDataURL(event.target.files[0]);
    }	// imgChange()

    public onSubmit(): void {
        this.errorMsg = "";
        this.statusMsg = "";

        if (this.isEditingUser) {
            this.modifyUser(this.user);
        } else {
            this.addUser(this.user);
        }

        if (this.errorMsg) {
            this.active = true;
        } else {
            if (this.isEditingUser)
                setTimeout(() => this.location.back(), 1000);
            else
                setTimeout(() => this.router.navigate([ "/" ]), 1000);
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
                    this.active = false;
                },
                error => {         // function to invoke on exceptional termination of the obs. sequence
                    this.errorMsg = <any>error;
                },
                () => {
                    // function to invoke upon graceful termination of the observable sequence
                    console.info("UserRegistrationComponent.addUser()'s observable completed gracefully");
                });
    }    // addUser()

    private modifyUser(user: User): void {
        this.userService.putUser(this.user)
            .subscribe(
                userData => {
                    this.user = userData;
                    this.password2 = "";
                    this.statusMsg = "User modified successfully";
                    this.active = true;
                },
                error => {
                    this.errorMsg = <any>error;
                },
                () =>{
                    console.info("UserRegistrationComponent.modifyUser()'s observable completed gracefully");
                });
    }    // modifyUser()

    ngOnInit() {
        this.currentUser = this.authService.currentUser;
        this.isAdmin = this.authService.usrRole === "admin";
        this.user = new User("", "", "");
        this.isEditingUser = false;

        this.sub = this.route.params.subscribe(
            params => {
                let id = params["id"];
                if (id) {
                    this.isEditingUser = true;
                    this.user = this.currentUser;
                    this.password2 = "";
                    // this.userService.getUser(id).subscribe(
                    //     userData => {
                    //         this.user = userData;
                    //         this.password2 = "";
                    //         console.info(`Setting register.component.user to ${JSON.stringify(this.user)}`);
                    //     }, error => this.errorMsg = <any>error
                    // );
                }
            }
        );


        // this.roles = [ "admin", "supervisor", "regular" ];
        this.roles = this.standingData.lists.roles;

        this.errorMsg = "";
        this.statusMsg = "";
        this.active = true;
    }    // ngOnInit()

    ngOnDestroy() {
        if (this.sub)
            this.sub.unsubscribe();
    }    // ngOnDestroy()
}    // class UserRegistrationComponent