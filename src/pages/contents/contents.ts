import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ContentsProvider } from '../../providers/contentsProvider';
import {ContentPage} from '../content/content';
import { AppConfig } from '../../providers/appConfig';
import { Loading } from '../../providers/loading';

@Component({
	selector: 'page-contents',
	templateUrl: 'contents.html'
})

export class Contents {

	icons: string[];
	items: Array<{
		_id: number,
		auteur: string,
		cibles: any,
		content: string,
		abstract: string,
		resume: string,
		date_end_publish: any,
		date_publish: any,
		nom: string,
		theme: string,
		type: number,
		medias: any,
		profil: number,
		slug: string,
		statut: number,
		video_id: any,
		video_vendor: Array<{}>,
		keywords: Array<{}>,
	}>;
	nbItems: number;
	skip: number = 0;
	type: string = "type_1";
	perPage: number = 20;
	pageTitle: any;
	videoUrl: string;

	contentsType: Array<{
		key: string,
		value: string
	}>;

	constructor(public navCtrl: NavController, public navParams: NavParams, public contentsProvider: ContentsProvider, public loading: Loading, public alertCtrl: AlertController, public config: AppConfig) {

		this.items = [];

		if (typeof navParams.get('type') !== 'undefined') {
			this.type = navParams.get('type');
		}

		this.contentsType = config.get('content_type');

		let type = this.type;
		this.pageTitle = this.contentsType.filter(function(obj) {
			return obj.key == type;
		});

	}

	/* init Page
	----------------------*/
	ionViewDidLoad() {
		this.loading.showLoader('Chargement...');
		this.doLoad(0);
	}

	doInfinite(infiniteScroll) {
		this.skip += this.perPage;
		if (this.skip < this.nbItems) {
			this.doLoad(this.skip);
			infiniteScroll.complete();
		} else {
			infiniteScroll.complete();
		}
	}

	doLoad(skip) {
		let filters = {
			'query':[
				{
					"type": this.type.slice(5),
					"statut": "1",
					"cibles": this.config.get('cible'),
				},
				{ "kObj_id": -1 },
				"contenus",
				this.perPage,
				this.skip
			]
		};

		this.contentsProvider.getContents(filters).then((res: any) => {
			this.nbItems = res.dataTotal;
			for (let i = 0; i < res.data.length; i++) {
				this.items.push(res.data[i]);
			}
			this.loading.loader.dismiss();
		}, (err) => {
			this.showError('Désolé !', 'Aucun résultat');
			console.log("Erreur de récupération des contenus : " + err);
			this.loading.loader.dismiss();
		});

	}

	showError(messTitle, message) {
		let alert = this.alertCtrl.create({
			title: messTitle,
			subTitle: message,
			buttons: ['OK']
		});
		alert.present();
	}


	itemTapped(event, item) {
		this.navCtrl.push(ContentPage, {
			item: item
		});
	}

	onChange() {
		this.navCtrl.push(Contents, {
			type: this.type
		});
	}

	onCancel() {
		return;
	}

}
