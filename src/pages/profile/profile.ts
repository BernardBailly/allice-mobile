import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams,AlertController,ToastController} from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { Loading } from '../../providers/loading';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html'
})

export class ProfilePage {

    form: FormGroup;
    submitAttempt: boolean = false;
	id: any = {};
	kObj_id:any='';
	nom: string = '';
	prenom: string = '';
	civilite: string = '';
	fonction: string = '';
	email: string = '';


	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public authService: Auth, public loading: Loading,public alertCtrl:AlertController,public toastCtrl: ToastController) {

		this.form = this.formBuilder.group({
			nom: [this.nom, Validators.required],
			prenom: [this.prenom, Validators.required],
			email: [this.email, Validators.required],
			fonction: [this.fonction],
			civilite: [this.civilite]

		});

	}

	ionViewDidLoad() {
		this.loading.showLoader('Patientez...');

		this.authService.me().then((res) => {
			let me = res[Object.keys(res)[0]];
			this.nom = me.nom;
			this.prenom = me.prenom;
			this.civilite = me.civilite;
			this.fonction = me.fonction;
			this.email = me.email;
			this.id = me._id.$id;
			this.kObj_id=me.kObj_id;

			this.form = this.formBuilder.group({
				nom: [this.nom],
				prenom: [this.prenom],
				email: [this.email],
				fonction: [this.fonction],
				civilite: [this.civilite]
			});

			this.loading.loader.dismiss();
		}, (err) => {
			console.log(err);
			this.loading.loader.dismiss();
		});

	}

	save() {
		this.loading.showLoader('Enregistrement en cours');
		this.form.value.id=this.id;
		this.form.value.kObj_id=this.kObj_id;
		console.log(this.form.value);
		this.authService.saveMe(this.form.value).then((res) => {
			this.authService.checkAuthentication().then(res=>{
				console.log('Nouveau profil',res);
				this.showSuccess('Votre profil a été mis à jour');
				this.loading.loader.dismiss();
			},err=>{
				console.log(err);
			});

		}, (err) => {
			this.showAlert('Erreur !',err);
			this.loading.loader.dismiss();
		});
    }


	showAlert(messTitle,message) {
	   let alert = this.alertCtrl.create({
		 title: messTitle,
		 subTitle: message,
		 buttons: ['OK']
	   });
	   alert.present();
	 }


	 showSuccess(message) {
	    let toast = this.toastCtrl.create({
	      message: message,
		   //position: 'middle',
	      duration: 3000
	    });
	    toast.present();
	  }

}
