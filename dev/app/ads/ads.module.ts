"use strict";

import { NgModule }       from "@angular/core";
import { CommonModule }   from "@angular/common";
import { FormsModule }    from "@angular/forms";
import { HttpModule /*, XHRBackend */} from "@angular/http";

// components
import { AdDetailComponent }  from "./ad-detail.component";
import { AdsComponent }  from "./ads-list.component";
import { AdReviewComponent } from "./ad-review.component";

import { AdsService } from "../Services/ads.service";
import { StandingData } from "../Services/standing.data.service";
import { AuthService } from "../Services/authentication.service";
import { PagerService } from "../Services/pager.service";

import { adRouting } from "./ads.routes";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        adRouting
    ],
    declarations: [
        AdDetailComponent,
        AdsComponent
    ],
    providers: [
        AdsService, StandingData, AuthService, PagerService
    ]
})
export class AdsModule { }
