import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Loading} from '../../providers/loading';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html'
})
export class SettingsPage {

	constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,public loading:Loading,public alertCtrl:AlertController) { }

	ionViewDidLoad() {
		console.log('ionViewDidLoad SettingsPage');
	}

	clearCache() {
		this.loading.showLoader('Nettoyage du cache en cours');
		this.storage.forEach((value, key, iterationNumber)=>{
			if ( key != 'token' && key != 'refresh_token') {
				this.storage.remove(key).then(() => {
					console.log("cache " + key + " Supprimé");
				},
					(err) => {
						console.log(err);
					})
			}
		});

		this.loading.loader.dismiss();
		this.showAlert('Terminé','Le contenu du cache a été supprimé. ')
	}

	showAlert(messTitle,message) {
	   let alert = this.alertCtrl.create({
		 title: messTitle,
		 subTitle: message,
		 buttons: ['OK']
	   });
	   alert.present();
	 }

}
