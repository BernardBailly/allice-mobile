import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ContentsProvider } from '../../providers/contentsProvider';
import {ContentPage} from '../content/content';
import { AppConfig } from '../../providers/appConfig';



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
		abstract:string,
		resume:string,
		date_end_publish: any,
		date_publish: any,
		nom: string,
		theme: string,
		type: number,
		medias: any,
		profil: number,
		slug:string,
		statut: number,
		video_id:any,
		video_vendor:Array<{}>,
		keywords:Array<{}>,
	}>;
	nbItems: number;
	loading: any;
	skip: number = 0;
	type: string = "type_1";
	perPage: number = 20;
	pageTitle: any;
	videoUrl:string;

	contentsType: Array<{
		key: string,
		value: string
	}>;

	constructor(public navCtrl: NavController,public navParams: NavParams,public contentsProvider: ContentsProvider,public loadingCtrl: LoadingController,public alertCtrl: AlertController,public config: AppConfig) {

		if (typeof navParams.get('type') !== 'undefined') {
			this.type = navParams.get('type');
		}

		this.contentsType = [
			{ "key": "type_1", "value": "Articles" },
			{ "key": "type_3", "value": "Brèves" },
			{ "key": "type_4", "value": "Evénements" },
			{ "key": "type_7", "value": "Documents" },
			{ "key": "type_5", "value": "Médias" },
			{ "key": "type_8", "value": "Réunion" },
			{ "key": "type_10", "value": "Vidéos" },
			{ "key": "type_11", "value": "Circulaire" }
		];

		let type=this.type;
		this.pageTitle = this.contentsType.filter(function(obj) {
			return obj.key == type;
		});

	}

	/* init Page
	----------------------*/
	ionViewDidLoad() {
		this.showLoader();
		let filters = {
			'query': JSON.stringify(
				[
					{
						"type": this.type.slice(5),
						"statut": "1",
						"cibles": this.config.get('cible')
					},
					{ "date_debut": 1 },
					"contenus",
					this.perPage,
					"0"
				]
			)
		};

		this.contentsProvider.getContents(filters).then((res: any) => {
			this.nbItems = res.dataTotal;
			this.items = res.data;
			this.loading.dismiss();
		}, (err) => {
			this.showError('Désolé !', 'Aucun résultats');
			console.log("Erreur de récupération des contenus : " + err);
			this.loading.dismiss();
		});

	}

	doInfinite(infiniteScroll) {
		this.skip += this.perPage;
		if (this.skip < this.nbItems) {
			let filters = {
				'query': JSON.stringify(
					[
						{
							"type": this.type.slice(5),
							"statut": "1",
							"cibles": this.config.get('cible')
						},
						{ "date_debut": 1 },
						"contenus",
						this.perPage,
						this.skip
					]
				)
			};

			this.contentsProvider.getContents(filters).then((res: any) => {
				for (let i = 0; i < res.data.length; i++) {
					this.items.push(res.data[i]);
				}
				infiniteScroll.complete();
			}, (err) => {
				this.showError('Désolé !', 'Aucun résultat');
				console.log("Erreur de récupération des contenus : " + err);
				infiniteScroll.complete();
			});
		} else {
			infiniteScroll.complete();
		}
	}

	showError(messTitle, message) {
		let alert = this.alertCtrl.create({
			title: messTitle,
			subTitle: message,
			buttons: ['OK']
		});
		alert.present();
	}

	showLoader() {

		this.loading = this.loadingCtrl.create({
			content: 'Chargement...'
		});
		this.loading.present();

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
