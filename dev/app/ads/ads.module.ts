"use strict";

import { NgModule }       from "@angular/core";
import { CommonModule }   from "@angular/common";
import { FormsModule }    from "@angular/forms";
import { HttpModule, XHRBackend } from '@angular/http';

import { AdListComponent }    from "./ad-list.component";
import { AdDetailComponent }  from "./ad-detail.component";

import { AdsService } from "./ads.service";

import { adRouting } from "./ads.routes";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        adRouting,
        HttpModule
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
