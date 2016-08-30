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
    }

    public getLists(): Lists {
        if (this.lists && 
            this.lists.categories && this.lists.categories.length > 0 &&
            this.lists.cities && this.lists.cities.length > 0 &&
            this.lists.roles && this.lists.roles.length > 0) {
            return Observable.create(this.lists);
        } else {
            this.loadStandingData().subscribe(
                result => this.lists,
                error => this.lists
            );
        }
    }    // getLists()

    private loadStandingData(): Observable<boolean> {
        this.token = JSON.parse(sessionStorage.getItem("token")) || "";
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

    public addCategory(edited: string): Observable<Lists> {
        if (!edited) {
            console.log(`addCategory was called with a bad category argument!`);
            return Observable.create(this.lists);
        }
        this.token = JSON.parse(sessionStorage.getItem("token")) || "";
        let headers = new Headers({ "Authorization": "Bearer " + this.token, "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let body: string = JSON.stringify({ category: edited });

        console.info(`addCategory calling API with: ${body}`);
        return this.http.post(this.listsUrl, body, options)
            .map((response: Response) => {
                let result = this.extractData(response);
                this.lists = this.extractData(response);
                console.info(`standing.data.service.lists set to: ${JSON.stringify(this.lists)}`);
                return result;
            })
            .catch(this.handleError);
    }    // addCategory()

    public modifyCategory(picked: string, edited: string): Observable<Lists> {
        if (!picked) {
            console.log(`modifyCategory was called with a bad category argument!}`);
            return Observable.create(this.lists);
        }

        if (!edited) {
            console.log(`modifyCategory was called with a bad modified category argument!`);
            return Observable.create(this.lists);
        }

        this.token = JSON.parse(sessionStorage.getItem("token")) || "";
        let headers = new Headers({ "Authorization": "Bearer " + this.token, "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let body: string = JSON.stringify({ category: picked, modified: edited });

        console.info(`modifyCategory calling API with: ${body}`);
        return this.http.put(this.listsUrl, body, options)
            .map((response: Response) => {
                let result = this.extractData(response);
                if (result && result.categories) {
                    this.lists = result;
                    console.info(`standing.data.service.lists set to: ${this.lists}`);
                    return result;
                }
            })
            .catch(this.handleError);
    }    // modifyCategory()

    public removeCategory(edited: string): Observable<Lists> {
        if (!edited) {
            console.log(`removeCategory was called with a bad category argument!`);
            return Observable.create(false);
        }

        this.token = JSON.parse(sessionStorage.getItem("token")) || "";
        let headers = new Headers({ "Authorization": "Bearer " + this.token });
        let options = new RequestOptions({ headers: headers });

        console.info(`removeCategory calling API with: ${edited}`);
        return this.http.delete(this.listsUrl + "/" + edited, options)
            .map((response: Response) => {
                    let result = this.extractData(response);
                    this.lists = this.extractData(response);
                    console.info(`standing.data.service.lists set to: ${JSON.stringify(this.lists)}`);
                    return result;
                })
            .catch(this.handleError);
    }    // removeCategory()

    // private helpers
    private removeCategoryFromLocalCache(category: string): void {
        if (category) {
            console.info(`standing.data.service.removeCategoryFromLocalCache(${category}) called.`);
            let foundAtIndex: number = -1;
            for (let i = 0; i < this.lists.categories.length && foundAtIndex < 0; ++i) {
                if (category === this.lists.categories[i])
                    foundAtIndex = i;
            }

            if (foundAtIndex > -1)
                this.lists.categories.splice(foundAtIndex, 1);
            console.info(`removeCategoryFromLocalCache -> ${this.lists.categories}`);
        }
    }    // removeCategoryFromLocalCache()

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