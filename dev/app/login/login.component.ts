import { Component } from "@angular/core";
import { NgForm } from "@angular/common";
import { AuthenticationService, User } from "./authentication.service";

@Component ({
    selector: "login-form",
    templateUrl: "./login.component.html",
    providers: [AuthenticationService]
})

export class LoginComponent {
    public user = new User("", "");
    public errorMsg = "";

    constructor(
        private _service: AuthenticationService) { }

    login() {
        if (!this._service.login(this.user)) {
            this.errorMsg = "Failed to login!";
        }
    }
}