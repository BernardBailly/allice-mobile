import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, Platform } from 'ionic-angular';
import { Loading } from '../../providers/loading';
import {Transfer} from 'ionic-native';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfig } from '../../providers/appConfig';


declare var cordova: any;


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
    videoUrl: any;
	fileLocation: any;
	docDownloaded:boolean=false;



	constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public alertCtrl: AlertController,public loading: Loading, public sanitizer: DomSanitizer, public config: AppConfig) {
		this.item = navParams.get('item');


        if (this.item.type == 10) {
			if (this.item.video_vendor[0] == 'YT') {
                this.item.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl("http://www.youtube.com/embed/" + this.item.video_id + "?rel=0");
            } else if (this.item.video_vendor[0] == 'Vimeo') {
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
			this.loading.showLoader('Télécharment en cours...');
			let doc = this.item.medias[3].file;
			const FileTransfer = new Transfer();
			FileTransfer.download(this.config.get('Api_root') + doc, this.storageDirectory + doc).then((entry) => {
				console.log(entry);
				this.fileLocation = entry;
				this.docDownloaded=true;
				this.loading.loader.dismiss();
				this.open()
			/*	const alertSuccess = this.alertCtrl.create({
					title: `Téléchargement terminé !`,
					subTitle: `Document téléchargé vers :<br><strong> ${entry.toURL()}</strong>`,
					buttons: ['Ok']
				});*/

				//alertSuccess.present();

			}, (error) => {

				const alertFailure = this.alertCtrl.create({
					title: `Erreur de téléchargement!`,
					subTitle: `${doc} n'a pas été télechargé correctement. Erreur code: ${error.code}`,
					buttons: ['Ok']
				});

				this.loading.loader.dismiss();
				alertFailure.present();

			});

		});

	}


	open() {

		let doc = this.config.get('Api_root') +this.item.medias[3].file;
		console.log(doc);
		cordova.InAppBrowser.open( doc, '_blank', 'location=no');
	}



}
