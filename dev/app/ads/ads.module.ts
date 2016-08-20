"use strict";

import { NgModule }       from "@angular/core";
import { CommonModule }   from "@angular/common";
import { FormsModule }    from "@angular/forms";
import { HttpModule /*, XHRBackend */} from "@angular/http";

// components
import { AdListComponent }    from "./ad-list.component";
import { AdDetailComponent }  from "./ad-detail.component";

import { AdsService } from "../Services/ads.service";

import { adRouting } from "./ads.routes";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        adRouting
    ],
    declarations: [
        AdListComponent,
        AdDetailComponent
    ],
    providers: [
        AdsService
    ]
})
export class AdsModule { }
