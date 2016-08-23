"use strict";

import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./Services/auth.guard";

// components
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { UserRegistrationComponent } from "./register/register.component";
import { UsersComponent } from "./users/users.component";
import { PageNotFoundComponent } from "./404.component";


const routes: Routes = [
    { path: "", data: { title: "Home" }, component: HomeComponent },
    { path: "about", data: { title: "About the App" }, component: AboutComponent, canActivate: [AuthGuard] },
    { path: "register", data: { title: "Register User" }, component: UserRegistrationComponent },
    { path: "users", data: { title: "Users" }, component: UsersComponent },
    { path: "users/:id", data: { title: "User data" }, component: UserRegistrationComponent },
    { path: "**", component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [];

export const routing = RouterModule.forRoot(routes);
