"use strict";

import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";


const userUrl: string =
    window.location.protocol + "//" +
    window.location.hostname +
    ((window.location.port === "80")
        ? ("")
        : (":" + window.location.port)) +
    "/api/users";

export class User {
    public constructor(
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
}    // class User

@Injectable()
export class UserService {
    public constructor (private http: Http) { }

    public addUser(user: User): Observable<User> {
        if (user.username && user.password) {

            let headers: Headers = new Headers({ "Content-Type": "application/json" });
            let body: string = JSON.stringify(user);
            let options: RequestOptions = new RequestOptions({ headers: headers });

            return this.http
                .post(userUrl, body, options)        // returns Observable<Response>
                .map(this.extractData)               // success
                .catch(this.handleError);            // error
        }
    }    // addUser()

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