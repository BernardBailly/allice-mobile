import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {

     Api_root:String = 'http://hub.allice.fr/';
     cible : string  ="site_15";


    get(name)
    {
        return this[name];
    }
}
