"use strict";

import { NgModule }       from "@angular/core";
import { CommonModule }   from "@angular/common";
import { FormsModule }    from "@angular/forms";

import { AdListComponent }    from "./ad-list.component";
import { AdDetailComponent }  from "./ad-detail.component";

import { AdsService } from "./ads.service";

import { adRoutes } from "./ads.routes";

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
console.log("In ads.module.ts");