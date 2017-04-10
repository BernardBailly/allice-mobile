import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {

     Api_root:String = 'http://hub.allice.fr/';
     cible : string  ="site_15";
     content_type : any =[
        { "key": "type_1", "value": "Articles" },
        { "key": "type_3", "value": "Brèves" },
        { "key": "type_4", "value": "Evénements" },
        { "key": "type_7", "value": "Documents" },
        { "key": "type_5", "value": "Médias" },
        { "key": "type_8", "value": "Réunion" },
        { "key": "type_10", "value": "Vidéos" },
        { "key": "type_11", "value": "Circulaire" }
    ];


    get(name)
    {
        return this[name];
    }
}
