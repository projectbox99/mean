"use strict";

import { Routes, RouterModule } from "@angular/router";

import { AdListComponent }    from "./ad-list.component";
import { AdDetailComponent }  from "./ad-detail.component";

const adRoutes: Routes = [
    { path: "ads",  component: AdListComponent },
    { path: "ads/:id", component: AdDetailComponent }
];

export const adRouting = RouterModule.forChild(adRoutes);
