import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';




@Injectable()
export class Loading {
    public loader: any;
    constructor(public  loadingCtrl:LoadingController) {}

    showLoader(message) {
        this.loader = this.loadingCtrl.create({
            content: message
        });
        this.loader.present();
    }


}
