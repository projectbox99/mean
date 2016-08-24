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
        return (this.namesFirst || "") + (this.namesLast || "");
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
                 /* private authService: AuthService */) {
        this.token = JSON.parse(sessionStorage.getItem("token"));
    }

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

        return this.http.get(this.userUrl, options)
            .map((response: Response) => this.extractData(response))
            .catch(this.handleError);
    }    // getUsers()

    public getUser(id: string): Observable<User> {
        if (!id) {
            console.log(`getUser was called with a bad id argument: ${id.toString()}`);
            return Observable.create(new User("", "", ""));
        }

        let headers = new Headers({ "Authorization": "Bearer " + this.token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.userUrl + "/" + id, options)
            .map((response: Response) => {
                let userData = this.extractData(response);
                if (userData._id && userData.username) {
                    userData.id = userData._id;
                    return userData;
                } else {
                    return Observable.create(new User("", "", ""));
                }
            })
            .catch(this.handleError);
    }    // getUser()

    public putUser(user: User): Observable<User> {
        if (!user || !user.id || !user.username || !user.password) {
            console.log(`putUser was called with a bad user argument: ${JSON.stringify(user)}`);
            return Observable.create(new User("", "", ""));
        }

        let headers = new Headers({ "Authorization": "Bearer " + this.token, "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let body: string = JSON.stringify(user);

        return this.http.put(this.userUrl + "/" + user.id, body, options)
            .map((response: Response) => {
                let userData = this.extractData(response);
                if (userData._id && userData.username) {
                    userData.id = userData._id;
                    console.info(`putUser returns: ${JSON.stringify(userData)}`);
                    return userData;
                } else {
                    return Observable.create(new User("", "", ""));
                }
            })
            .catch(this.handleError);
    }    // putUser()

    public deleteUser(id: string): Observable<boolean> {
        if (!id) {
            console.log(`deleteUser was called with a bad id argument: ${id.toString()}`);
            return Observable.create(false);
        }

        let headers = new Headers({ "Authorization": "Bearer " + this.token });
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(this.userUrl + "/" + id, options)
            .map((response: Response) => {
                console.log("deleteUser response: " + this.extractData(response));
                return this.extractData(response) === "OK";
            })
            .catch((error) => {
                this.handleError(error).map((errMsg) => console.error("deleteUser Error: " + errMsg));
                return Observable.create(false);
            });
    }    // deleteUser()


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