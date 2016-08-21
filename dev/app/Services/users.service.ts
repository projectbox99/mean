"use strict";

import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

// import { AuthService } from "./authentication.service";


export class User {
    constructor(
        public id: string = null,
        public username: string,
        public password: string,
        public namesFirst?: string,
        public namesLast?: string,
        public email?: string,
        public phone1?: string,
        public phone2?: string,
        public skypeId?: string,
        public photo?: string,
        public role?: string,
        public dateCreated?: Date) { }

    public get names(): string {
        return `${this.namesFirst || ""} ${this.namesLast || ""}`;
    }    // get names()
}    // class User

@Injectable()
export class UserService {
    private userUrl: string =
        window.location.protocol + "//" +
        window.location.hostname +
        ((window.location.port === "80")
            ? ("")
            : (":" + window.location.port)) + "/api/users";

    private token: string;

    constructor (private http: Http
                 /* private authService: AuthService */) { }

    // anyone can register a new user
    public addUser(user: User): Observable<User> {
        let headers: Headers = new Headers({ "Content-Type": "application/json" });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        let body: string = JSON.stringify(user);

        return this.http.post(this.userUrl, body, options)   // returns Observable<Response>
            .map(this.extractData)               // success
            .catch(this.handleError);            // error
    }    // addUser()

    public getUsers(): Observable<User[]> {
        // add authorization header with jwt token
        let headers = new Headers({ "Authorization": "Bearer " + this.token });
        let options = new RequestOptions({ headers: headers });
        console.log("In users.service.getUsers()");

        // get users from api
        return this.http.get(this.userUrl, options)
            .map((response: Response) => this.extractData(response))
            .catch(this.handleError);
    }    // getUsers()


    // private helpers
    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }    // extractData()

    private handleError (error: any) {
        let errMsg =
            (error.message)
                ? error.message
                : (error.status)
                    ? `${error.status} - ${error.statusText}`
                    : "Server Error";

        return Observable.throw(errMsg);
    }    // handleError()
}    // class RegisterService