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


}
