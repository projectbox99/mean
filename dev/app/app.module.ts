"use strict";

import { NgModule } from "@angular/core";
import { BrowserModule }  from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';

// used to create fake backend
import { fakeBackendProvider } from './fake-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AuthenticationService } from './authentication.service';
import { AuthGuard } from "./auth.guard";
import { UserService } from './register/register.service';

import { AppLayout } from "./app.layout";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { UserRegistrationComponent } from "./register/register.component";
import { PageNotFoundComponent } from "./404.component";
import { routing, appRoutingProviders } from "./app.routes";


import { AdsModule } from "./ads/ads.module";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        AdsModule
    ],
    declarations: [
        AppLayout,
        HomeComponent,
        AboutComponent,
        UserRegistrationComponent,
        PageNotFoundComponent
    ],
    providers: [
        appRoutingProviders,
        AuthGuard,
        AuthenticationService,
        UserService,

        // providers used to create fake backend
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions
    ],
    bootstrap: [ AppLayout ]
})
export class AppModule { }
