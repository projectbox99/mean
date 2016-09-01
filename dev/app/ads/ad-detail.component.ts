"use strict";

import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ElementRef, NgZone } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Response } from "@angular/http";
import { Location } from "@angular/common";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { User } from "../Services/users.service";
import { AdsService, Ad } from "../Services/ads.service";
import { StandingData, Lists } from "../Services/standing.data.service";
import { AuthService } from "../Services/authentication.service";
import { RestoreService } from "../Services/restore.service";

@Component ({
    templateUrl: "ad-detail.component.html",
    styleUrls: [ "ad-detail.component.css" ],
    providers: [ AdsService, RestoreService ]
})
export class AdDetailComponent implements OnInit, OnDestroy {
    @Output() canceled = new EventEmitter();
    @Output() saved = new EventEmitter();

    // @Input()
    // set ad (ad: Ad) {
    //     this.restoreService.setItem(ad);
    // }

    // get ad () {
    //     return this.restoreService.getItem();
    // }
    private ad:Ad;

    private currentUser: User;
    private curUsrRole: string;

    private selectedId: string;

    private lists: Lists;
    private sub: Subscription;

    private active: boolean;
    private loading: boolean;
    private isEditingAd: boolean;
    private errorMsg: string;
    private statusMsg: string;

    // Image uploads
    private photoMain: string;
    private photos: string[];
    private percent: number;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private adsService: AdsService,
                private standingData: StandingData,
                private authService: AuthService,
                private restoreService: RestoreService<Ad>,
                private element: ElementRef,
                private location: Location,
                private ngZone: NgZone) {
        this.curUsrRole = authService.usrRole;

        this.lists = new Lists([], [], []);
        this.loadStandingData();
        this.percent = 0;

        this.photoMain = "";
        this.photos = <string[]>[];
    }

    public get diagnostic(): string { return JSON.stringify(this.ad); }

    private drop(event: any, count: number = 0): void {
    	event.stopPropagation();
    	event.preventDefault();

    	let files = event.dataTransfer.files;
    	let filesCount = files.length;
    	for (let i = 0; i < filesCount; i++) {
    		console.info(`[${i}] ${files[i]} ${files[i].name} ${files[i].size}`);
    	}

    	let reader: any = new FileReader();
    	let image = this.element.nativeElement.querySelector("#photo" + count);
    	let file: File = files[0];

    	reader.onload = (e) => {
    		if (count == 0) {
	            console.log("Changing photoMain...");
	            this.photoMain = e.target.result;
	            image.src = this.photoMain;
	        } else if (count <= 5) {
	        	console.log(`Changing photo[${count - 1}]...`);
	        	this.photos[count - 1] = e.target.result;
	        	image.src = this.photos[count - 1];
	        } else {
	        	return;
	        }
        }

        reader.readAsDataURL(file);
        this.uploadFile(file, count);
    }

    private uploadFile(file: File, count: number): void {
    	this.makeFileRequest("/upload", file)
    		.then(
    			result => {
    				if (count === 0) {
                        console.log("------------>" + result.fileName);
						this.ad.photoMain = result.fileName;
					} else {
						this.ad.photos[count - 1] = result.fileName;
					}
    			},
    			error => {
    				console.error(error);
    			}
    		);
    }	// uploadFile()

    private makeFileRequest(url: string, file: File): any {
    	return new Promise((resolve, reject) => {
	    	let xhr = new XMLHttpRequest();
	    	let formData: any = new FormData();
	    	formData.append("file", file, file.name);

	    	xhr.onreadystatechange = () => {
	    		if (xhr.readyState == 4) {
	    			if (xhr.status == 200) {
	    				resolve(xhr.response.data);
	    			} else {
	    				this.percent = 0;
		    			reject(xhr.response);
	    			}
	    		}
    		};

    		xhr.upload.onprogress = (e) => {
    			window.setTimeout(() => {
    				this.percent = Math.ceil((e.loaded / e.total) * 100);
    				console.log(this.percent + "%");    				
    			}, 10);
    		}

			xhr.open("POST", url, true);
			xhr.responseType = "json";
	    	xhr.send(formData);
    	});
    }	// makeFileRequest()

    private allowDrop(event): void {
    	event.stopPropagation();
    	event.preventDefault();
    }

    public imgChange(event: any, count: number = 0) {
        let target = EventTarget;
        let image = this.element.nativeElement.querySelector(`#photo${count}`);
        let reader: any = new FileReader();
        var self = this;

        reader.onload = function(e) {
            if (count === 0) {
                console.log("Changing main image...");
                self.photoMain = e.target.result;
                image.src = self.photoMain;
            } else {
                console.log(`Changing image ${count - 1}...`);
                self.photos[count - 1] = e.target.result;
                image.src = self.photos[count - 1];
                console.log(self.photos.length);
            }
        }

        reader.readAsDataURL(event.target.files[0]);
    }    // imgChange()

    public loadStandingData(): void {
        this.lists = this.standingData.getLists();
    }    // loadStandingData()

    public onSubmit(): void {
        this.errorMsg = "";
        this.statusMsg = "";

        if (this.isEditingAd) {
            this.modifyAd(this.ad);
        } else {
            this.addAd(this.ad);
        }

        if (this.errorMsg) {
            this.active = true;
        } else {
            if (this.isEditingAd)
                setTimeout(() => this.location.back(), 1000);
            else
                setTimeout(() => this.router.navigate([ "/" ]), 1000);
        }
    }    // onSubmit()

    public clearForm(): void {
        // features a temporary workaround while we await a proper form reset feature
        this.ad = new Ad();
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }    // clearForm()

    public gotoPreview(): void {
        if (this.ad.id) {
            this.router.navigate([ "/ads/preview", this.ad.id ]);
        }
    }    // gotoPreview()

    private addAd(ad: Ad): void {
        this.adsService.postAd(this.ad)
            .subscribe(            // we want an Observable returned
                adData => {      // function to invoke for each element in the observable sequence
                    this.ad = adData;
                    this.statusMsg = "Ad created successfully";
                    this.active = false;
                },
                error => {         // function to invoke on exceptional termination of the obs. sequence
                    this.errorMsg = <any>error;
                },
                () => {
                    // function to invoke upon graceful termination of the observable sequence
                    console.info("UserRegistrationComponent.addUser()'s observable completed gracefully");
                });
    }    // addAd()

    private modifyAd(ad: Ad): void {
        this.adsService.putAd(this.ad)
            .subscribe(
                adData => {
                    this.ad = adData;
                    this.statusMsg = "User modified successfully";
                    this.active = true;
                },
                error => {
                    this.errorMsg = <any>error;
                },
                () =>{
                    console.info("UserRegistrationComponent.modifyUser()'s observable completed gracefully");
                });
    }    // modifyAd()

    saveAd() {
        if (this.ad.id) {
            this.adsService.putAd(this.ad).subscribe(
                ad => this.ad = ad,
                error => this.handleError(error));
        } else {
            this.adsService.postAd(this.ad).subscribe(
                ad => this.ad = ad,
                error => this.handleError(error));
        }
    }	// saveAd()

    deleteAd(id: string, event: any): void {
        event.stopPropagation();
        this.loading = true;

        if (id) {
            this.adsService.deleteAd(id).subscribe(
                result => {
                    if (result === true) {
                        this.selectedId = null;
                        this.gotoAds();
                    }
                },
                error => this.handleError(error),
                () => {
                    this.loading = false;
                });
        }
    }	// deleteAd()

    gotoAds() {
        this.router.navigate(["/ads"]);
        // let adId = this.ad ? this.ad.id : null;
        // this.router.navigate(["/ads", { id: adId }]);
    }   // gotoAds()

    ngOnInit() {
        this.currentUser = this.authService.currentUser;
        this.ad = new Ad();
        this.ad.owner = this.currentUser.id;

        this.isEditingAd = false;

        this.sub = this.route.params.subscribe(
            params => {
                let id = params["id"];
                if (id && id !== "create") {
                    this.isEditingAd = true;
                    this.adsService.getAd(id).subscribe(
                        adData => {
                            this.ad = adData;

                            this.photoMain = this.ad.photoMain ? "/uploads/" + this.ad.photoMain : "";
                            for (let i = 0; i < this.ad.photos.length; i++) {
                            	this.photos[i] = "/uploads/" + this.ad.photos[i];
                            }
                            console.info(`Setting register.component.user to ${JSON.stringify(this.ad)}`);
                        }, error => this.errorMsg = <any>error
                    );
                } else {
                    this.ad.approved = false;
                }
            }
        );

        this.errorMsg = "";
        this.statusMsg = "";
        this.active = true;
        this.loading = false;
    }    // ngOnInit()

    ngOnDestroy() {
        if (this.sub)
            this.sub.unsubscribe();
    }    // ngOnDestroy()

    private handleError (error: any) {
        this.errorMsg = (error.message)
            ? error.message
            : error.status
                ? `${error.status} - ${error.statusText}`
                : "Server error";

        console.error(this.errorMsg);
        return Observable.throw(this.errorMsg);
    }    // handleError()
}