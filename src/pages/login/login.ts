import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { Loading } from '../../providers/loading';
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


    constructor(public navCtrl: NavController, public authService: Auth, public loading: Loading,public alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
    }

    login(){

        this.loading.showLoader('Authentification...');

        let credentials = {
            username: this.email,
            password: this.password,
            grant_type:'password',
            client_id :'mobile_user',
            client_secret:'mobile_pwd',
        };


        this.authService.login(credentials).then((result) => {
            this.authService.checkAuthentication();
            this.loading.loader.dismiss();
            console.log('Yes ! Vous êtes authentifié');
            this.navCtrl.setRoot(Contents);
        }, (err) => {
            this.loading.loader.dismiss();
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



}
