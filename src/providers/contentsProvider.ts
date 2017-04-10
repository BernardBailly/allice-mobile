import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AppConfig } from './appConfig';
import {Auth} from "./auth";
import 'rxjs/add/operator/map';
/*
Generated class for the Contents provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/
@Injectable()

export class ContentsProvider {

	constructor(public http: Http, public storage: Storage, public config: AppConfig, private auth: Auth) { }


	getContents(filters) {
		return new Promise((resolve, reject) => {
			let cacheKey = this.createCacheKey(filters);
			this.storage.get(cacheKey).then(contents => {
				if (contents != null) {
						//console.log(contents);
						resolve(contents);
					/*this.fetchContents(filters).then((contents) => {
						resolve(contents)
					}, (err) => {
						reject(err)
					});*/
				} else {
					this.fetchContents(filters).then((contents) => {
						resolve(contents)
					}, (err) => {
						reject(err)
					});
				}
			}, (err) => {
				reject(err)
			}
			);
		});
	}

	fetchContents(filters) {
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			headers.append('Content-Type', 'application/x-www-form-urlencoded');
			let cacheKey = this.createCacheKey(filters);
			this.storage.get('token').then((token) => {
                let params = [];
                params['access_token'] = token;
                //filters.query[0]['profil'] = [{ '$lte': 1 }];

                this.prepareGroupesFilters().then(res => {
					filters.query[0]['$and'] = [res];
					params['query'] = JSON.stringify(filters.query);
					this.http.post(this.config.get('Api_root') + 'api/contents', this.transformRequest(params), { headers: headers })
						.subscribe(res => {
							let data = res.json();
							if (data.dataTotal) {
								this.storage.set(cacheKey, data);
								resolve(data);
							} else {
								reject('Aucune données');
							}
						}, (err) => {
							reject(err);
						});
                }, err => {
					console.log(err)
                    reject(err);
				});
			});
		});

	}

    prepareGroupesFilters() {
        return new Promise((resolve, reject) => {
			this.auth.me().then(res => {
                let me = res[Object.keys(res)[0]];
                let groupes = me.groupes;
                resolve({
                    '$or': [
						{ 'groupes': { '$in': groupes } },
						{ 'groupes': '' },
						{ 'groupes': { '$exists': false } }
					]
				})
			}, err => {
				console.log(err);
                reject(err);
			});
		});
    }

	createCacheKey(filters) {
		let q = filters.query;
		return "contents_" + q[0].type + "_" + q[4]
	}

	transformRequest(params) {
		let urlSearchParams = new URLSearchParams();
		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				urlSearchParams.append(key, params[key]);
			}
		}

		return urlSearchParams.toString();
	}

}
