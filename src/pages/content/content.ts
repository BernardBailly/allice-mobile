import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Loading } from '../../providers/loading';
import { Transfer} from 'ionic-native';
import { File } from '@ionic-native/file';
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
	storageDirectory: string = 'file://';
    videoUrl: any;
	fileLocation: any;
	docDownloaded: boolean = false;



	constructor(private file: File, public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public alertCtrl: AlertController, public loading: Loading, public sanitizer: DomSanitizer, public config: AppConfig) {
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
				this.storageDirectory = cordova.file.cacheDirectory;
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
			this.loading.showLoader('Téléchargement en cours...');
			let doc = this.item.medias[3].file;
			let docName: string = doc.split('/')[2];
			this.file.checkFile(this.file.externalCacheDirectory, docName).then(_ => {
				console.log('file exist in cache');
				this.loading.loader.dismiss();
				this.open(this.file.externalCacheDirectory + docName)
			}).catch(err => {
				const FileTransfer = new Transfer();
				FileTransfer.download(this.config.get('Api_root') + '/index.php?rawdata=1&unce_contenus=0&view=download&file=' + doc, this.file.externalCacheDirectory + docName).then((entry) => {
					console.log('download',entry);
					this.loading.loader.dismiss();
					this.open(entry.nativeURL)
				})
			}), (error) => {
				const alertFailure = this.alertCtrl.create({
					title: `Erreur de téléchargement!`,
					subTitle: `${doc} n'a pas été télechargé correctement. Erreur code: ${error.code}`,
					buttons: ['Ok']
				});
				this.loading.loader.dismiss();
				alertFailure.present();
			};

		});


	}


	open(doc) {
		console.log('lecture de ', doc);
		cordova.InAppBrowser.open(doc, '_system', 'location=no');
	}



}
