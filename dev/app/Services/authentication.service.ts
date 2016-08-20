import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import { Observable } from "rxjs/Observable";

import { User } from "./users.service";


@Injectable()
export class AuthService {
    public token: string;
    public currentUser: User = new User("", "", "");

    constructor(private http: Http) {
        // set token if saved in session storage
        let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        this.token = currentUser && currentUser.token;
        console.log(`AuthService instance created! Token: ${JSON.stringify(this.token)}`);
    }

    public get usrLoggedIn(): boolean {
        return this.currentUser && this.currentUser.username.trim() !== "";
    }    // get usrLoggedIn()

    public get usrRole(): string {
        if (this.currentUser && this.currentUser.role.trim() !== "")
            return this.currentUser.role;

        return "";
    }    // get usrRole()

    public get usrUsername(): string {
        if (this.currentUser && this.currentUser.username.trim() !== "")
            return this.currentUser.username;

        return "";
    }    // get usrUsername()

    public get usrNamesFirst(): string {
        if (this.currentUser && this.currentUser.namesFirst.trim() !== "")
            return this.currentUser.namesFirst;

        return "";
    }    // get usrNamesFirst()

    public login(username, password): Observable<boolean> {
        return this.http.post("/api/authenticate", JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem("currentUser", JSON.stringify({ username: username, token: token }));

                    // extract logged-in user data from response
                    let usrData = response.json().usr;
                    if (usrData) {
                        this.currentUser = JSON.parse(usrData);
                    }

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }    // login()

    public logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        sessionStorage.removeItem("currentUser");

        this.currentUser = new User("", "", "");
    }    // logout()
}    // class AuthService