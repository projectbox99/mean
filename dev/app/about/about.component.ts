import { Component } from "@angular/core";
import { AboutService } from "../Services/about.service";


@Component ({
    selector: "view",
    templateUrl: "./about.component.html"
})
export class AboutComponent { 
	private info: any;
	private items: string[];
	public JSON;

	constructor(private aboutService: AboutService){ 
		this.JSON=JSON;
		this.info = {};
		this.items = <string[]>[];

		this.getInfo();
	}

	private getInfo(): void {
		this.aboutService.aboutInfo().subscribe(
			res => {
				this.info = res;
				for (let inf in this.info) {
					this.items.push(inf);
				}
			},
			err => {
				console.log(err);
			}
		)
	}
}