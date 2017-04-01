import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { AppConfig } from './appConfig';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
Generated class for the Auth provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Auth {

    public token: any;
    public refresh_token: any;
    public expiration: any;

    constructor(public http: Http, public storage: Storage, public config: AppConfig) {

    }


    me() {
        return new Promise((resolve, reject) => {
            this.storage.get('me').then((value) => {
                resolve(value);
			}, (err) => {
				reject(err);
			});

        });
    }

    saveMe(me) {
        return new Promise((resolve, reject) => {
            this.storage.get('token').then((token) => {

				let data = [];
				data['field'] = JSON.stringify(me);
				data['collection'] = 'unce_lecteurs';
				data['rawdata'] = 1;
				data['unce_lecteurs'] = me.id;
				data['action'] = 'setLecteurService';
				data['access_token'] = token;
				let headers = new Headers();
				headers.append('Content-Type', 'application/x-www-form-urlencoded');

				this.http.post(this.config.get('Api_root') + 'api/saveme', this.transformRequest(data), { headers: headers })
					.subscribe(res => {
						let data = res.json();
						resolve(data);
					}, (err) => {
						reject(err);
					});

			});
		});

    }

    checkAuthentication() {
        return new Promise((resolve, reject) => {
            this.storage.get('token').then((value) => {
                this.token = value;
                let headers = new Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                this.http.post(this.config.get('Api_root') + 'api/me', this.transformRequest({ 'access_token': this.token }), { headers: headers })
					.subscribe(res => {
						let data = res.json();
						this.storage.set('me', data);
						resolve(data);
					}, (err) => {
						this.logout();
						reject(err);
					});
            });

        });

    }





    login(credentials) {

        return new Promise((resolve, reject) => {

            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            this.http.post(this.config.get('Api_root') + 'token', this.transformRequest(credentials), { headers: headers })
				.subscribe(res => {

					let data = res.json();
					this.token = data.access_token;
					this.refresh_token = data.refresh_token;
					this.expiration = data.expires_in;

					this.storage.set('token', data.access_token);
					this.storage.set('refresh_token', data.refresh_token);
					this.storage.set('expiration', data.expires_in);
					resolve(data);
				}, (err) => {
					reject(err);
				});

        });

    }


    transformRequest(data) {

        let urlSearchParams = new URLSearchParams();
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                urlSearchParams.append(key, data[key]);
            }
        }
        return urlSearchParams.toString();
    }

    logout() {
        this.storage.set('token', '');
        this.storage.remove('me');
        this.storage.remove('refresh_token');
        this.storage.remove('expiration');
    }

}
