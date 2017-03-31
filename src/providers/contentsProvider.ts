import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AppConfig } from './appConfig';
import 'rxjs/add/operator/map';
/*
Generated class for the Contents provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/
@Injectable()

export class ContentsProvider {

  constructor(public http: Http, public storage: Storage, public config: AppConfig) { }


  getContents(filters) {
    return new Promise((resolve, reject) => {
      let cacheKey = this.createCacheKey(filters);
      this.storage.get(cacheKey).then(contents => {
        if (contents != null) {
            console.log(contents);
          resolve(contents);
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
      this.http.post(this.config.get('Api_root') + 'api/contents', this.transformRequest(filters), { headers: headers })
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
    });
  }

  createCacheKey(filters) {
    let q = JSON.parse(filters.query);
    return "contents_" + q[0].type + "_" + q[4]
  }

  transformRequest(filters) {
    let urlSearchParams = new URLSearchParams();
    for (var key in filters) {
      if (filters.hasOwnProperty(key)) {
        urlSearchParams.append(key, filters[key]);
      }
    }
    return urlSearchParams.toString();
  }

}
