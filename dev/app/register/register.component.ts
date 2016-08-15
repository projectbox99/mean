import { Component } from "@angular/core";
import { NgForm } from "@angular/common";
import { Register, RegisterService } from "./register.service";

@Component ({
    selector: "view",
    templateUrl: "./register.component.html",
    styles: [".ng-valid[required] { border-left: 5px solid #42A948; } .ng-invalid { border-left: 5px solid #a94442; }"]
})

export class RegisterComponent {
    constructor() {
        this.model = new Register("", "", "", "", "", "", "", "", "", "", null);
        this.active = true;
    }

    model: Register;
    submitted: boolean = false;
    active = true;

    onSubmit() {
        this.submitted = true;
    }

    get diagnostic() { return JSON.stringify(this.model); }
}