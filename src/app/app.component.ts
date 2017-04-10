import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Auth } from '../providers/auth';



import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { Page1 } from '../pages/page1/page1';
import { Contents } from '../pages/contents/contents';
import { SettingsPage } from '../pages/settings/settings';
import { Push, PushToken } from '@ionic/cloud-angular';



@Component({
	templateUrl: 'app.html'
})
export class AlliceApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any;
	loading: any;

	pages: Array<{ title: string, component: any, icon: any }>;

	constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public authService: Auth, public push: Push, public loadingCtrl: LoadingController) {
		this.initializeApp();

		if (platform.is('cordova')) {
			this.push.register().then((t: PushToken) => {
				return this.push.saveToken(t);
			}).then((t: PushToken) => {
				console.log('Token saved:', t.token);
			});

			this.push.rx.notification()
				.subscribe((msg) => {
					alert(msg.title + ': ' + msg.text);
				});
		}

		// used for an example of ngFor and navigation
		this.pages = [

			{ title: 'Contenus', component: Contents, icon: 'document' },
			{ title: 'Mon compte', component: ProfilePage, icon: 'person' },
			{ title: 'Paramètres', component: SettingsPage, icon: 'cog' },
			{ title: 'A Propos', component: Page1, icon: 'calendar' },

		];

	}

	/* Init app
	----------------------*/
	initializeApp() {

		this.showLoader();
		this.platform.ready().then(() => {
			this.authService.checkAuthentication().then((res) => {
				console.log('User déjà authentifié');
				this.rootPage = Contents;
				this.loading.dismiss();
			}, (err) => {
				this.rootPage = LoginPage;
				this.loading.dismiss();
			});
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	showLoader() {

		this.loading = this.loadingCtrl.create({
			content: 'Patientez authentification en cours...'
		});
		this.loading.present();

	}

	/* Open page
	----------------------*/
	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}

	/* Log out
	----------------------*/
	logout() {
		this.authService.logout();
		this.nav.setRoot(LoginPage);
	}
}
