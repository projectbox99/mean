"use strict";

import { Routes, RouterModule } from "@angular/router";

import { AdDetailComponent }  from "./ad-detail.component";
import { AdsComponent }  from "./ads-list.component";
import { AdReviewComponent } from "./ad-review.component";


const adRoutes: Routes = [
	{ path: "ads/list/:id", component: AdsComponent },
    { path: "ads/:id", component: AdDetailComponent },
    { path: "ads/preview/:id", component: AdReviewComponent }
];

export const adRouting = RouterModule.forChild(adRoutes);
