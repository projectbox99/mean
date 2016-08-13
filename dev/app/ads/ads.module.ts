"use strict";

import { NgModule }       from "@angular/core";
import { CommonModule }   from "@angular/common";
import { FormsModule }    from "@angular/forms";

import { AdListComponent }    from "./ad-list.component";
import { AdDetailComponent }  from "./ad-detail.component";

import { adRoutes } from "./ads.routes";

import { AdsService } from "./ads.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        adRoutes
    ],
    declarations: [
        AdListComponent,
        AdDetailComponent
    ],
    providers: [
        AdsService
    ]
})
export class AdsModule {}