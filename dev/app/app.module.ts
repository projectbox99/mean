"use strict";

import { NgModule } from "@angular/core";
import { BrowserModule }  from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppLayout } from "./app.layout";
import { routing, appRoutingProviders } from "./app.routes";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { PageNotFoundComponent } from "./404.component";

import { AdsModule } from "./ads/ads.module";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        AdsModule
    ],
    declarations: [
        AppLayout,
        HomeComponent,
        AboutComponent,
        PageNotFoundComponent
    ],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [ AppLayout ]
})
export class AppModule { }