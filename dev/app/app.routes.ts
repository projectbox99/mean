"use strict";

import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
// import { PageNotFoundComponent } from "./404.component";

import { AdListComponent } from "./ads/ad-list.component";

const routes: Routes = [
    {
        path: "",
        redirectTo: '/home',
        pathMatch: 'full'
    },
    { path: "home", data: { title: "Home" }, component: HomeComponent },
    { path: "about", data: { title: "About the App" }, component: AboutComponent },
    { path: "ads", data: { title: "Ads title" }, component: AdListComponent },
    // { path: "**", component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(routes);
console.log("In app.routes.ts");