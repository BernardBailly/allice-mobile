import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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

	constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) { }

	ionViewDidLoad() {
		console.log('ionViewDidLoad SettingsPage');
	}

	clearCache() {
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
	}

}
