"use strict";

import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";

const adsUrl: string =
    window.location.protocol + "//" +
    window.location.hostname +
    ((window.location.port === "80")
        ? ("")
        : (":" + window.location.port)) +
    "/api/ads";

export class Ad {
    constructor(
        public id: number,
        public title: string,
        public category: string,
        public photos: string[],
        public city: string,
        public price: number,
        public owner: string,
        public dateCreated: Date,
        public dateValid: Date) { }
}

@Injectable()
export class AdsService {
    constructor(private http: Http) {
        console.info("AdsService.constructor!");
    }

    getAds(): Observable<Ad[]> {
        console.info("AdsService.getAds!");
        console.log(`${adsUrl}`);
        return this.http.get(adsUrl, {})
            .map(this.extractData)
            .catch(this.handleError);
    }    // getAds()

    getAd(id: number | string): Observable<Ad> {
        console.info("AdsService.getAd!");
        return this.http.get(adsUrl + "/" + id, {})
            .map( (res: Response) => {
                console.log(res.json().data);
                return res.json().data;
            });
    }    // getAd()

    private extractData(res: Response) {
        console.info("AdsService.extractData!");
        let body = res.json();
        return body.data || {};
    }    // extractData()

    private handleError (error: any) {
        console.info("AdsService.handleError!");
        let errMsg = (error.message)
            ? error.message
            : error.status
            ? `${error.status} - ${error.statusText}`
            : 'Server error';

        console.error(errMsg);
        return Observable.throw(errMsg);
    }    // handleError()
}    // class AdsService