"use strict";

import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";

const userUrl: string =
    window.location.protocol + "//" +
    window.location.hostname +
    ((window.location.port === "80")
        ? ("")
        : (":" + window.location.port)) +
    "/api/users";

export class Register {
    constructor(
        public username: string = "",
        public password: string = "",
        public namesFirst: string = "",
        public namesLast: string = "",
        public email: string = "",
        public phone1: string = "",
        public phone2: string = "",
        public skypeId: string = "",
        public photo: string = "",
        public role: string = "",
        public dateCreated: Date = new Date) { }
}

@Injectable ()
export class RegisterService{
    constructor (private http: Http) { }
    
}