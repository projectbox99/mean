import { NgModule } from "@angular/core";
import { BrowserModule }  from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { routing, appRoutingProviders } from "./app.routes";
import { AppLayout } from "./app.layout";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { PageNotFoundComponent } from "./404.component";


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing
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