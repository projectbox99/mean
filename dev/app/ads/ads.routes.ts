"use strict";

import { Routes, RouterModule } from "@angular/router";

import { AdListComponent }    from "./ad-list.component";
import { AdDetailComponent }  from "./ad-detail.component";

const ad_Routes: Routes = [
    { path: "ads",  component: AdListComponent },
    { path: "ads/:id", component: AdDetailComponent }
];

export const adRoutes = RouterModule.forChild(ad_Routes);