import { Component, OnInit } from '@angular/core';
//Atho
import { AngularFireAuth } from '@angular/fire/auth';
//loding
import { LoadingController } from '@ionic/angular';
//alert
import { AlertController } from '@ionic/angular';
//Alertservice
import { AlertserviceService } from '../../../services/alertservice.service';
//cantroal
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private data: any = {
    "email": "",
    "password": ""
  }
  constructor(private fbauth: AngularFireAuth, private loadingController: LoadingController,
    private alertController: AlertController, private alert: AlertserviceService
    ,public navController:NavController) {}

  

  ngOnInit() {
  }

  //login
  async loginWithFBdetails() {
     //shoe lodaing
     const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present(); 

    this.fbauth.signInWithEmailAndPassword(this.data.email, this.data.password)
      .then((authData) => {
        
        loading.dismiss();
        this.alert.presentAlert("Login");
      }).catch((authError) => {

        loading.dismiss();
        this.presentAlert(authError.message);
      })
  }

  //Massage Alert
  async presentAlert(msg) {
        const alert = await this.alertController.create({
          header: 'Talabat App',
          message: msg,
          buttons: ['OK']
        });
    
        await alert.present();
      }

 //Forget Password
 async ForgetPassword() {
  this.ForgetPasswordAlert();
}

//Alert for Forget Password
async ForgetPasswordAlert() {
  const alerttest = await this.alertController.create({
    header: 'Forgot Password',
    cssClass: 'forgetpasswordalertstyle',
    subHeader: 'You will receive a link in your email to reset your password',
    inputs: [
      {
        name: 'email',
        type: 'email',
        placeholder: 'Enter email'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'forgetpasswordalertstyle',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        cssClass: 'forgetpasswordalertstyle',
        handler: (LoginDetails) => {
          console.log(LoginDetails.email);
          this.fbauth.sendPasswordResetEmail(LoginDetails.email).then((secc) => {
            this.alert.presentAlert("please check your email for Rest your password");
           //this.presentAlert("please check your email for Rest your password");
          }
          ).catch((error) => {
            this.alert.presentAlert(error.message);
            //this.presentAlert(error.message);
          })
        }
      }
    ]
  });

  await alerttest.present();
}
}

