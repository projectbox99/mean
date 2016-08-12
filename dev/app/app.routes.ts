import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { PageNotFoundComponent } from "./404.component";

const routes: Routes = [
    { path: "", data: { title: "Home" }, component: HomeComponent },
    { path: "about", data: { title: "About the App" }, component: AboutComponent },
    { path: "**", component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(routes);