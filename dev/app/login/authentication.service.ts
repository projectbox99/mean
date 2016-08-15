import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

export class User {
    constructor(
        public username: string,
        public password: string) { }
}

let users = [
    new User("admin", "admin"),
    new User("user", "user")
];

@Injectable()
export class AuthenticationService {

    constructor (private _router: Router) { }

    logout() {
        localStorage.removeItem("user");
        this._router.navigate(["Login"]);
    }

    login(user) {
        let authenticatedUser = users.find (u => u.username === user.username);
        if (authenticatedUser) {
            localStorage.setItem("user", authenticatedUser.username); // ("user", authenticatedUser);
            this._router.navigate(["home"]);
            return true;
        }
        return false;
    }

    checkCredentials() {
        if (localStorage.getItem("user") === null) {
            this._router.navigate(["hogin"]);
        }
    }
}