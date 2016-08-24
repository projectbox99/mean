"use strict";

import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

// import { AuthService } from "./authentication.service";


export class Lists {
    constructor(public categories: string[], 
                public cities: string[],
                public roles: string[]) { }
}    // class Lists

@Injectable()
export class StandingData {
    public lists: Lists;

    private token: string;

    private listsUrl: string =
        window.location.protocol + "//" +
        window.location.hostname +
        ((window.location.port === "80")
            ? ("")
            : (":" + window.location.port)) + "/api/lists";

    constructor (private http: Http
                 /* private authService: AuthService */) {
        this.lists = new Lists([], [], []);
        this.token = JSON.parse(sessionStorage.getItem("token")) || "";
    }

    public getLists(): Lists {
        if (this.lists && 
            this.lists.categories && this.lists.categories.length > 0 &&
            this.lists.cities && this.lists.cities.length > 0 &&
            this.lists.roles && this.lists.roles.length > 0) {
            return this.lists;
        } else {
            this.loadStandingData().subscribe(
                result => {
                    this.lists
                },
                error => this.lists
            );
        }
    }    // get getCategories

    private loadStandingData(): Observable<boolean> {
        let headers = new Headers({ "Authorization": "Bearer " + this.token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.listsUrl, options)
            .map((response: Response) => {
                let reply = this.extractData(response);
                if (reply.categories && reply.cities && reply.roles) {
                    this.lists.categories = reply.categories;
                    this.lists.cities = reply.cities;
                    this.lists.roles = reply.roles;
                    return Observable.create(true);
                } else {
                    return Observable.create(false);
                }
            })
            .catch((error) => this.handleError(error));
    }    // loadStandingData()


    // private helpers
    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }    // extractData()

    private handleError (error) {
        let errMsg =
            (error.message)
                ? error.message
                : (error.status)
                    ? `${error.status} - ${error.statusText}`
                    : "Server Error";
        console.error("error: " + errMsg);
        return Observable.throw(errMsg);
    }    // handleError()
}    // class RegisterService