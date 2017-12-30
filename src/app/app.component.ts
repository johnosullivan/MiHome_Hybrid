import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ModalController } from 'ionic-angular';
import { RegisterPage } from '../pages/register/register';
import { AboutPage } from '../pages/about/about';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ProfilePage } from '../pages/profile/profile';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { DataProvider } from '../providers/data-service/data-service';
import { DevicesPage } from '../pages/devices/devices';
import { WindowRef } from './WindowRef';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('navCtrl') navCtrl: NavController

  rootPage: any = HomePage;

  pages: Array<{title: string, icon:string, component: any}>;
  authpages: Array<{title: string, icon:string, component: any}>;

  constructor(public dataProvider:DataProvider,
    public userServiceProvider:UserServiceProvider,
    public authServiceProvider:AuthServiceProvider,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public modalCtrl: ModalController ) {
    this.initializeApp();

    this.pages = [
      { title: 'Home', icon:'home', component: HomePage },
      { title: 'Login', icon:'log-in', component: LoginPage },
      { title: 'Register', icon:'person-add', component: RegisterPage },
      { title: 'About', icon:'information-circle', component: AboutPage }
    ];

    this.authpages = [
      { title: 'Dashboard', icon:'desktop',component: DashboardPage },
      { title: 'My Hubs', icon:'hammer', component: DevicesPage },
      { title: 'My Profile', icon:'person', component: ProfilePage },
      { title: 'About', icon:'information-circle', component: AboutPage }
    ];

    var self = this;
    this.userServiceProvider.getToken().then(function(token){
        if (token === null) {
          self.authServiceProvider.setAuth(false);
        } else {
          self.authServiceProvider.setAuth(true);
        }
    });

  }

  test() {
    var self = this;
    this.userServiceProvider.removeToken().then(function(token){
      self.authServiceProvider.setAuth(false);
     // self.navCtrl.setRoot(HomePage);
     self.nav.setRoot(HomePage);
    });
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#69b5c6');
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if (page.title == "Login") {

      let loginModal = this.modalCtrl.create(page.component, { });
      loginModal.onDidDismiss(obj => {
        console.log(JSON.stringify(obj));
      if (obj.status) {
        this.dataProvider.devices(obj.user.id,obj.token).subscribe(
          data => {
            if (data['data'].length != 0) {
              this.nav.setRoot(DashboardPage);
            } else {
              this.nav.setRoot(DevicesPage);
            }
          },
          err => {

          }
        );

      }
      });
      loginModal.present();

    } else if (page.title == "Register") {
      let registerModal = this.modalCtrl.create(page.component, { userId: 8675309 });
      registerModal.onDidDismiss(obj => {
        this.authServiceProvider.login(obj.creds).subscribe(
          data => {
            if (data.success) {
              console.log(data);
              this.userServiceProvider.saveToken(data.token);
              this.userServiceProvider.saveUser(data.user);
              this.authServiceProvider.setAuth(true);
              this.nav.setRoot(DevicesPage);
            } else {

            }
          },
          err => {
            console.log(JSON.stringify(err._body));
          },
          () => console.log('Auto Logging in....')
        );
      });
      registerModal.present();
    } else {
      this.nav.setRoot(page.component);
    }

  }
}
