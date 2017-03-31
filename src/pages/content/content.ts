import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
import { ContentsProvider } from '../../providers/contentsProvider';
import {File, Transfer} from 'ionic-native';
import { DomSanitizer } from '@angular/platform-browser';
let cordova: any;

/*
  Generated class for the Content page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-content',
	templateUrl: 'content.html'
})
export class ContentPage {
	item: any;
	storageDirectory: string = '';
    videoUrl:any;


	constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public alertCtrl: AlertController,public sanitizer :DomSanitizer) {
		this.item = navParams.get('item');


        if(this.item.type==10){
			if(this.item.video_vendor[0]=='YT'){
                this.item.videoUrl=this.sanitizer.bypassSecurityTrustResourceUrl("http://www.youtube.com/embed/"+this.item.video_id+"?rel=0");
            }else if(this.item.video_vendor[0]=='Vimeo'){
                //this.item.videoUrl='http://www.youtube.com/embed/'+this.item.video_id+'?rel=0';
            }
		}

		this.platform.ready().then(() => {
			// make sure this is on a device, not an emulation (e.g. chrome tools device mode)
			if (!this.platform.is('cordova')) {
				return false;
			}

			if (this.platform.is('ios')) {
				this.storageDirectory = cordova.file.documentsDirectory;
			}
			else if (this.platform.is('android')) {
				this.storageDirectory = cordova.file.dataDirectory;
			}
			else {
				// exit otherwise, but you could add further types here e.g. Windows
				return false;
			}
		});
	}

	ionViewDidLoad() {

	}

	download() {
		this.platform.ready().then(() => {

			let doc = this.item.medias[3].file;
			const fileTransfer = new Transfer();
			fileTransfer.download(doc, this.storageDirectory + doc).then((entry) => {

				const alertSuccess = this.alertCtrl.create({
					title: `Download Succeeded!`,
					subTitle: `${doc} a été téléchargé vers: ${entry.toURL()}`,
					buttons: ['Ok']
				});

				alertSuccess.present();

			}, (error) => {

				const alertFailure = this.alertCtrl.create({
					title: `Erreur de téléchargement!`,
					subTitle: `${doc} n'a pas été télechargé correctement. Erreur code: ${error.code}`,
					buttons: ['Ok']
				});

				alertFailure.present();

			});

		});

	}


}
