import { Component } from '@angular/core';
import { NavController, LoadingController,AlertController } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { Contents } from '../contents/contents';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

    email: string;
    password: string;
    loading: any;

    constructor(public navCtrl: NavController, public authService: Auth, public loadingCtrl: LoadingController,public alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
    /*    this.showLoader();
        //Check if already authenticated
        this.authService.checkAuthentication().then((res) => {
            console.log("Already authorized");
            this.loading.dismiss();
            this.navCtrl.setRoot(Contents);
        }, (err) => {
            console.log("Not already authorized");
            this.loading.dismiss();
        });*/

    }

    login(){

        this.showLoader();

        let credentials = {
            username: this.email,
            password: this.password,
            grant_type:'password',
            client_id :'mobile_user',
            client_secret:'mobile_pwd',
        };


        this.authService.login(credentials).then((result) => {
            this.loading.dismiss();
            console.log('Yes ! Vous êtes authentifié');
            this.navCtrl.setRoot(Contents);
        }, (err) => {
            this.loading.dismiss();
            this.showError('Désolé !','Merci de vérifier vos identifiants de connexion.');
            this.email='';
            this.password='';
            //console.log(err);
        });

    }

    showError(messTitle,message) {
       let alert = this.alertCtrl.create({
         title: messTitle,
         subTitle: message,
         buttons: ['OK']
       });
       alert.present();
     }

    showLoader(){

        this.loading = this.loadingCtrl.create({
            content: 'Authentification...'
        });
        this.loading.present();

    }

}
