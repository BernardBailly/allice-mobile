import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AlliceApp } from './app.component';
import { IonicStorageModule  } from '@ionic/storage';
import { Auth } from '../providers/auth';
import { Loading } from '../providers/loading';
import { ContentsProvider } from '../providers/contentsProvider';
import { AppConfig } from '../providers/appConfig';

import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { Page1 } from '../pages/page1/page1';
import { Contents } from '../pages/contents/contents';
import { ContentPage } from '../pages/content/content';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '58f74dbb'
  },
  'push': {
    'sender_id': '344649845555',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};



@NgModule({
  declarations: [
    AlliceApp,
    LoginPage,
    ProfilePage,
    Page1,
    Contents,
    ContentPage,
    SettingsPage
  ],
  imports: [
    IonicModule.forRoot(AlliceApp),
    IonicStorageModule.forRoot(),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AlliceApp,
    LoginPage,
    ProfilePage,
    Page1,
    Contents,
    ContentPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Auth,
    Loading,
    ContentsProvider,
    AppConfig,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule { }
