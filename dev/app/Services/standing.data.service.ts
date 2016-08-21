"use strict";

import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

// import { AuthService } from "./authentication.service";


export class Lists {
    constructor(public categories: string[], public cities: string[]) { }
}    // class Lists

@Injectable()
export class StandingData {
    private categories: string[];
    private cities: string[];

    private userUrl: string =
        window.location.protocol + "//" +
        window.location.hostname +
        ((window.location.port === "80")
            ? ("")
            : (":" + window.location.port)) + "/api/lists";

    constructor (private http: Http
                 /* private authService: AuthService */) {
        // this.getStandingData();
        this.categories = [];
        this.cities = [];
    }

    public get getCategories(): string[] {
        if (!this.categories) {
            this.loadStandingData().subscribe(
                sd => {
                    console.log(`SD: getCategories pulled sd: ${JSON.stringify(sd)}`);
                    this.categories = sd.categories;
                    this.cities = sd.cities;
                },
                error => {console.log(`Error retrieving SD: ${JSON.stringify(error)}`);}
            );
        }

        return this.categories;
    }    // get getCategories()

    public get getCities(): string[] {
        return this.cities;
    }    // get getCities()



    public getStandingData(): void {
        this.loadStandingData().subscribe(
            sd => {
                console.info(JSON.stringify(sd));
                this.categories = sd.categories;
                this.cities = sd.cities;
            },
            error => console.error(`Error retrieving lists: ${JSON.stringify(error)}`));
    }    // getStandingData()

    private loadStandingData(): Observable<Lists> {
        // standing data from api
        console.log("Getting SD!");
        return this.http.get("/api/lists")
            .map((response: Response) => this.extractData(response))
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