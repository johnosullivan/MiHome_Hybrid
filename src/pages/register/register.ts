import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  regs = {}
  payload:any;
  isSpinner:boolean;
  error:any;
  constructor(public authServiceProvider:AuthServiceProvider,public navCtrl: NavController, public navParams: NavParams, public viewController:ViewController) {
    this.payload = {}
    this.isSpinner = false;
    this.error = '';
  }

  ionViewDidLoad() {

  }

  closeModal() {
    this.navCtrl.pop();
  }

  register() {
    console.log(this.payload);
    this.isSpinner = true;
    this.authServiceProvider.register(this.payload).subscribe(
      data => {
        if (data.success) {
          console.log(data);
          this.isSpinner = false;
          this.viewController.dismiss({status:true,creds:this.payload});
        } else {

        }
      },
      err => {
        console.log(JSON.stringify(err._body));
        this.error = JSON.parse(err._body).message;
        this.isSpinner = false;
      },
      () => console.log('Register')
    );
  }

}
