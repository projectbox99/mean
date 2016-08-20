import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

import { AuthService } from "./authentication.service";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    // static methods
    public canActivate(): boolean {
        if (this.hasTokenInSessionStorage) {
            return true;
        }

        this.navigateHome();
        return false;
    }    // canActivate()

    public canActivateRegularRoute(): boolean {
        if (this.hasTokenInSessionStorage) {
            return true;
        }

        this.navigateHome();
        return false;
    }    // canActivateRegularRoute()

    public canActivateSupervisorRoute(): boolean {
        if (this.hasTokenInSessionStorage &&
            (this.authService.currentUser.role === "supervisor" || this.authService.currentUser.role === "admin")) {
            return true;
        }

        this.navigateHome();
        return false;
    }    // canActivateSupervisorRoute()

    public canActivateAdminRoute(): boolean {
        if (this.hasTokenInSessionStorage && this.authService.currentUser.role === "admin") {
            return true;
        }

        this.navigateHome();
        return false;
    }    // canActivateAdminRoute()


    // helpers
    private hasTokenInSessionStorage(): boolean {
        return sessionStorage.getItem("currentUser") ? true : false;
    }    // hasTokenInSessionStorage()

    private hasTokenInLocalStorage(): boolean {
        return localStorage.getItem("currentUser") ? true : false;
    }    // hasTokenInLocalStorage()

    private navigateHome(): void {
        let routeOut: string = "/";
        this.router.navigate([ routeOut ]);
    }    // navigateHome()
}    // class AuthGuard