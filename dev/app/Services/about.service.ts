import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Injectable } from "@angular/core";

import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class AboutService {
    constructor(private http: Http) { }

    private url: string =
        window.location.protocol + "//" +
        window.location.hostname +
        ((window.location.port === "80")
            ? ("")
            : (":" + window.location.port)) + "/api/about";


    public results: any;

    public aboutInfo(): Observable<any> {
        return this.http.get(`${this.url}`)
                .map(
                    res => {
                        let data: any = this.extractData(res);
                        return data;
                    })
                .catch(this.handleError);
    }

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