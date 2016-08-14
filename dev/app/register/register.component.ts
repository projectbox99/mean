import { Component } from "@angular/core";
import { NgForm } from "@angular/common"
import { Register, RegisterService } from "./register.service";

@Component ({
    selector: "view",
    templateUrl: "./register.component.html"
})

export class RegisterComponent { 
    private submitted: boolean = false;
    
    onSubmit() {
        this.submitted = true;
    }
}