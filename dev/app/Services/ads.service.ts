"use strict";

import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";


export class Ad {
    constructor(
        public id: string = "",
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
    private adsUrl: string =
        window.location.protocol + "//" +
        window.location.hostname +
        ((window.location.port === "80")
            ? ("")
            : (":" + window.location.port)) + "/api/ads";

    private token: string;

    constructor(private http: Http) {
        this.token = JSON.parse(sessionStorage.getItem("token"));
    }

    public getAds(): Observable<Ad[]> {
        let headers = new Headers({ "Authorization": "Bearer " + this.token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.adsUrl, options)
            .map(this.extractData)
            .catch(this.handleError);
    }    // getAds()

    public getAd(id: string): Observable<Ad> {
        if (!id) {
            console.log(`getAd was called with a bad id argument: ${id.toString()}`);
            return Observable.create(new Ad());
        }
        let headers = new Headers({ "Authorization": "Bearer " + this.token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.adsUrl + "/" + id, options)
            .map((response: Response) => {
                let adData = this.extractData(response);
                if (adData._id) {
                    adData.id = adData._id;
                    return adData;
                } else {
                    return Observable.create(new Ad());
                }
            })
            .catch(this.handleError);
    }    // getAd()

    public postAd(ad: Ad): Observable<Ad> {
        let headers: Headers = new Headers({ "Content-Type": "application/json" });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        let body: string = JSON.stringify(ad);

        return this.http.post(this.adsUrl, body, options)   // returns Observable<Response>
            .map(this.extractData)               // success
            .catch(this.handleError);            // error
    }    // postAd()

    public putAd(ad: Ad): Observable<Ad> {
        if (!ad || !ad.id) {
            console.log(`putUser was called with a bad user argument: ${JSON.stringify(ad)}`);
            return Observable.create(new Ad());
        }

        let headers = new Headers({ "Authorization": "Bearer " + this.token, "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let body: string = JSON.stringify(ad);

        return this.http.put(this.adsUrl + "/" + ad.id, body, options)
            .map((response: Response) => {
                let adData = this.extractData(response);
                if (adData._id) {
                    adData.id = adData._id;
                    return adData;
                } else {
                    return Observable.create(new Ad());
                }
            })
            .catch(this.handleError);
    }    // putAd()

    public deleteAd(id: string): Observable<boolean> {
        if (!id) {
            console.log(`deleteAd was called with a bad id argument: ${id.toString()}`);
            return Observable.create(false);
        }

        let headers = new Headers({ "Authorization": "Bearer " + this.token });
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(this.adsUrl + "/" + id, options)
            .map((response: Response) => {
                return this.extractData(response) === "OK";
            })
            .catch((error) => {
                this.handleError(error).map((errMsg) => console.error("deleteUser Error: " + errMsg));
                return Observable.create(false);
            });
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