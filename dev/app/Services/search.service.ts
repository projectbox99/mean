import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Injectable } from "@angular/core";

import { Ad } from "./ads.service";
import { User } from "./users.service";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class SearchService {
    constructor(private http: Http) {
        this.token = JSON.parse(sessionStorage.getItem('token'));
    }

    private url_Ads: string =
        window.location.protocol + "//" +
        window.location.hostname +
        ((window.location.port === "80")
            ? ("")
            : (":" + window.location.port)) + "/api/ads/search";

    private token: string;

    public results: Ad[];
    public count: number;

    public searchInAds(str: string, cat: string = "", city: string = ""): Observable<Ad[]> {
        if (str) {
            let headers = new Headers({ "Authorization": "Bearer " + this.token, "Content-Type": "application/json" });
            let options = new RequestOptions({ headers: headers });
            let body: string = JSON.stringify({ str: str, cat: cat, city: city });

            return this.http.post(`${this.url_Ads}`, body, options)
                .map(
                    res => {
                        let data: any = this.extractData(res);
                        this.count = data.count;
                        return data.ads;
                    })
                .catch(this.handleError);
        }
    }    // searchInAds()

    // private helpers
    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }    // extractData()

    private handleError (error: any): Observable<string> {
        let errMsg = (error.message)
            ? error.message
            : (error.status)
                ? `${error.status} - ${error.statusText}`
                : "Server Error";

        console.error(errMsg);
        return Observable.throw(errMsg);
    }    // handleError()
}