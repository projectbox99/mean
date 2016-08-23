import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";

import { User } from "./users.service";


@Injectable()
export class AuthService {
    public token: string;
    public currentUser: User;

    constructor(private http: Http) {
        // set token if saved in session storage
        this.currentUser = new User("", "", "");
        this.token = JSON.parse(sessionStorage.getItem("token"));
        console.log(`AuthService instance created! Token: ${JSON.stringify(this.token)}`);
    }

    public get usrLoggedIn(): boolean {
        return this.currentUser.username &&
            this.currentUser.username.trim() !== "" &&
            this.token !== "";
    }// get usrLoggedIn()

    public get usrRole(): string {
        if (this.currentUser.role && this.currentUser.role.trim() !== "")
            return this.currentUser.role.trim();

        return "";
    }    // get usrRole()

    public get usrUsername(): string {
        if (this.currentUser.username && this.currentUser.username.trim() !== "")
            return this.currentUser.username.trim();

        return "";
    }    // get usrUsername()

    public get usrNamesFirst(): string {
        if (this.currentUser.namesFirst && this.currentUser.namesFirst.trim() !== "")
            return this.currentUser.namesFirst.trim();

        return "";
    }    // get usrNamesFirst()

    public login(username, password): Observable<boolean> {
        let headers: Headers = new Headers({ "Content-Type": "application/json" });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        let body: string = JSON.stringify({ username: username, password: password });

        console.log(`AuthService: sending request for ${username}, ${password}`);
        return this.http.post("/api/login", body, options)
            .map((response: Response) => {
                console.log(`AuthService: received reply: ${JSON.stringify(response.json())}`);
                // login successful if there's a jwt token in the response
                let token = response.json().data && response.json().data.token;
                if (token) {
                    // set token property
                    this.token = token;
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem("token", JSON.stringify(this.token));
                    console.log(`AuthService: this.token set to ${this.token}`);
                }

                console.log(JSON.stringify(response.json().data.user));
                let userData = JSON.stringify(response.json().data.user);
                console.log(`AuthService: attempting to set currentUser to ${userData}`);
                if (userData) {
                    this.currentUser = JSON.parse(userData);
                    console.log(`AuthService: this.currentUser set to ${this.currentUser}`);
                }

                if (!this.token || !this.currentUser) {
                    // return false to indicate failed login
                    return false;
                }

                // return true to indicate successful login
                return true;
            })
            .catch((error) => this.handleError(error));
    }    // login()

    public logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        sessionStorage.removeItem("token");

        this.currentUser = new User("", "", "");
    }    // logout()

    private handleError (error: any) {
        let errMsg =
            (error.message)
                ? error.message
                : (error.status)
                    ? `${error.status} - ${error.statusText}`
                    : "Server Error";

        return Observable.throw(errMsg);
    }    // handleError()
}    // class AuthService