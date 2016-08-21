"use strict";

import { NgModule } from "@angular/core";
import { BrowserModule }  from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

// used to create fake backend
// import { MockBackend, MockConnection } from "@angular/http/testing";
// import { BaseRequestOptions } from "@angular/http";
// import { fakeBackendProvider } from "./Services/fake-backend";

// services
// import { AuthService } from "./Services/authentication.service";
// import { AuthGuard } from "./Services/auth.guard";
import { UserService } from "./Services/users.service";
import { StandingData } from "./Services/standing.data.service";

// components
import { AppLayout } from "./app.layout";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { UserRegistrationComponent } from "./register/register.component";
import { UsersComponent } from "./users/users.component";
import { PageNotFoundComponent } from "./404.component";

// directives
import { NavLinkDirective } from "./Directives/nav-link-behavior";

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
        UsersComponent,
        PageNotFoundComponent,

        NavLinkDirective
    ],
    providers: [
        appRoutingProviders,
        // AuthGuard,
        // AuthService,
        UserService,
        StandingData

        // providers used to create fake backend
        // fakeBackendProvider,
        // MockBackend,
        // BaseRequestOptions
    ],
    bootstrap: [ AppLayout ]
})
export class AppModule { }
