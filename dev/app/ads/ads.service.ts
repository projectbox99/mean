"use strict";

import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import "rxjs/Rx";
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
        public id: number = 0,
        public title: string = "",
        public category: string = "",
        public desc: string = "",
        public photos: string[] = [],
        public city: string = "",
        public price: number = 0,
        public owner: string = "",
        public dateCreated: Date = new Date,
        public dateValid: Date = new Date) { }
}    // class Ad

@Injectable()
export class AdsService {
    private adsCache: Ad[] = [];
    private adCache: Ad = null;

    constructor(private http: Http) { }

    public getAds(): Observable<Ad[]> {
        console.info("AdsService.getAds!");
        console.log(`${adsUrl}`);

        return this.http.get(adsUrl, {})
            .map(this.extractData)
            .catch(this.handleError);
    }    // getAds()

    public getAd(id: number | string): Observable<Ad> {
        console.info("AdsService.getAd!");
        return this.http
            .get(adsUrl + "/" + id, {})
            .map(this.extractData)
            .catch(this.handleError);
    }    // getAd()

    public postAd(ad: Ad): Observable<Ad> {
        console.info("AdsService.postAd!");
        let headers: Headers = new Headers();
        headers.append("Content-Type", "application/json");

        return this.http
            .post(adsUrl, JSON.stringify(ad), { headers: headers })
            .map(this.extractData)
            .catch(this.handleError);
    }    // postAd()

    public putAd(ad: Ad): Observable<Ad> {
        console.info("AdsService.putAd!");
        let headers: Headers = new Headers;
        headers.append("Content-Type", "application/json");

        return this.http
            .put(adsUrl + "/" + ad.id, JSON.stringify(ad), { headers: headers })
            .map(this.extractData)
            .catch(this.handleError);
    }    // putAd()

    public deleteAd(ad: Ad): Observable<Ad> {
        console.info("AdsService.deleteAd!");
        let headers: Headers = new Headers;
        headers.append("Content-Type", "application/json");

        return this.http
            .delete(adsUrl + "/" + ad.id, { headers: headers })
            .map(this.extractData)
            .catch(this.handleError);
    }    // deleteAd()

    private extractData(res: Response) {
        console.info("AdsService.extractData!");
        let body = res.json();
        return body.data || {};
    }    // extractData()

    private handleError (error: any): Observable<string> {
        console.info("AdsService.handleError!");
        let errMsg = (error.message)
            ? error.message
            : (error.status)
                ? `${error.status} - ${error.statusText}`
                : "Server Error";

        console.error(errMsg);
        return Observable.throw(errMsg);
    }    // handleError()
}    // class AdsService