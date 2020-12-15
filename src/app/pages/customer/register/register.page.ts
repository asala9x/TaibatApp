import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertserviceService } from '../../../services/alertservice.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    private customerDetails: any = {
        "name": "",
        "email": "",
        "password": "",
        "userType": "customer"
    }
    private Confirmpassword = "";
    constructor(private atho: AngularFireAuth, private loadingController: LoadingController,
        private alertController: AlertController, private DB: AngularFireDatabase,
        private alert: AlertserviceService) { }
    ngOnInit() {
    }
    //method to regster user in Atho
    async registerUserInFB() {
        //shoe lodaing
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        if (this.customerDetails.name == "") {
            this.alert.presentAlert("plaes enter your name");
        } else if (this.customerDetails.email == "") {
            this.alert.presentAlert("plaes enter your Email");
        } else if (this.customerDetails.password == "") {
            this.alert.presentAlert("plaes enter your Password");
        } else if (this.Confirmpassword == "") {
            this.alert.presentAlert("plaes enter Confirm password");
        } else if (this.Confirmpassword != this.customerDetails.password) {
            this.alert.presentAlert("Password and Confirmpassword is not match");
        } else {
            await loading.present();
            this.atho.createUserWithEmailAndPassword(this.customerDetails.email, this.customerDetails.password)
                .then((authdata) => {
                    //success 
                    loading.dismiss();
                    //EmailVerification
                    this.atho.currentUser.then((currentUserData) => {
                        currentUserData.sendEmailVerification().then((verificationData) => {
                            //to insert data to DB
                            delete this.customerDetails.password; //to delete password so it will not added in DB
                            this.DB.list('user').update(authdata.user.uid, this.customerDetails).then((ifSeccess) => {
                                loading.dismiss();
                                this.alert.presentAlert("user registered successfuly , see your Email to verfiy");
                            }).catch((Error) => {
                                loading.dismiss();
                                this.alert.presentAlert(Error.message);
                            });

                        }).catch((error) => {
                            loading.dismiss();
                            this.alert.presentAlert("Enable to get current user");
                        })
                    })
                }).catch((autherror) => {
                    loading.dismiss();
                    this.alert.presentAlert(autherror.message);
                });
        }
    }
    //Massage Alert
    // async presentAlert(msg) {
    //   const alert = await this.alertController.create({
    //     header: 'Taibat App',
    //     message: msg,
    //     buttons: ['OK']
    //   });
    //   await alert.present();
    // }

}
