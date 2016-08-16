"use strict";

import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { UserRegistrationComponent } from "./register/register.component";
import { PageNotFoundComponent } from "./404.component";

const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },
    { path: "home", data: { title: "Home" }, component: HomeComponent },
    { path: "about", data: { title: "About the App" }, component: AboutComponent },
    { path: "register", data: { title: "Register User" }, component: UserRegistrationComponent },
    { path: "**", component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(routes);
